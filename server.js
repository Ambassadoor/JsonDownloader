// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackConfig = require("./webpack.config.js");
const { google } = require("googleapis");
const oAuth2Client = require("./src/oauth2client"); // Import the OAuth2 client
const getAuthUrl = require("./src/auth"); // Import the function to get the auth URL
const { getSemesters } = require("./js/SemesterSelector.js");
const { runPuppeteer } = require("./js/downloader.js")
const axios = require("axios");
const { scrapeTable } = require("./js/scrapeTable.js");
const { saveTokens, getTokens } = require("./src/tokenManager.js");
const { validateAndRefreshToken } = require("./src/validateToken.js");
require("dotenv").config();

// Runs `iterator` over `items` with at most `limit` calls in flight at once
async function mapWithConcurrency(items, limit, iterator) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex++;
      results[currentIndex] = await iterator(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

// A 200 from Google's batch endpoint only means the outer request was accepted -
// each PATCH inside it has its own embedded HTTP status that must be checked
// individually to know whether that specific event instance actually updated.
function parseBatchResponse(response) {
  const contentType = response.headers["content-type"] || "";
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/);
  const boundary = boundaryMatch ? boundaryMatch[1] || boundaryMatch[2] : null;

  if (!boundary || typeof response.data !== "string") {
    return { succeeded: [], failed: [] };
  }

  const parts = response.data
    .split(`--${boundary}`)
    .map((part) => part.trim())
    .filter((part) => part && part !== "--");

  const succeeded = [];
  const failed = [];

  for (const part of parts) {
    const idMatch = part.match(/Content-ID:\s*<?response-([^>\r\n]+)>?/i);
    const statusMatch = part.match(/HTTP\/1\.1 (\d+)/);
    const id = idMatch ? idMatch[1] : null;
    const status = statusMatch ? parseInt(statusMatch[1], 10) : null;

    if (status >= 200 && status < 300) {
      succeeded.push({ id, status });
    } else {
      const jsonMatch = part.match(/\{[\s\S]*\}/);
      let error = null;
      if (jsonMatch) {
        try {
          error = JSON.parse(jsonMatch[0]);
        } catch (e) {
          error = jsonMatch[0];
        }
      }
      failed.push({ id, status, error });
    }
  }

  return { succeeded, failed };
}

const RETRYABLE_REASONS = new Set([
  "rateLimitExceeded",
  "userRateLimitExceeded",
  "quotaExceeded",
  "backendError",
]);

function isRetryable(failure) {
  if (failure.status === 429 || failure.status >= 500) return true;
  const reason = failure.error?.error?.errors?.[0]?.reason;
  return RETRYABLE_REASONS.has(reason);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Pulls each sub-request's raw "PATCH ... \r\nContent-Type: ...\r\n\r\n{json}" text out of a
// batch body, keyed by its Content-ID, so a retry batch can be rebuilt from just the failed ones.
function extractBatchParts(body, boundary) {
  const parts = body
    .split(`--${boundary}`)
    .map((part) => part.trim())
    .filter((part) => part && part !== "--");

  const requestsById = new Map();
  for (const part of parts) {
    const idMatch = part.match(/Content-ID:\s*<([^>]+)>/i);
    const separatorMatch = part.match(/\r?\n\r?\n([\s\S]*)/);
    if (idMatch && separatorMatch) {
      requestsById.set(idMatch[1], separatorMatch[1]);
    }
  }
  return requestsById;
}

function buildRetryBatchBody(requestsById, ids, boundary) {
  let body = "";
  for (const id of ids) {
    const requestText = requestsById.get(id);
    if (!requestText) continue;
    body += `--${boundary}\r\n`;
    body += `Content-Type: application/http\r\n`;
    body += `Content-ID: <${id}>\r\n\r\n`;
    body += `${requestText}\r\n\r\n`;
  }
  body += `--${boundary}--`;
  return body;
}

// Sends a Calendar batch request, retrying only the sub-requests that fail with a
// retryable (rate-limit/backend) error, using exponential backoff between attempts.
async function sendCalendarBatchWithRetry(body, boundary, accessToken, maxRetries = 7) {
  const url = "https://www.googleapis.com/batch/calendar/v3";
  let currentBody = body;
  let currentBoundary = boundary;
  const allSucceeded = [];
  const allFailed = [];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const headers = {
      "Content-Type": `multipart/mixed; boundary="${currentBoundary}"`,
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.post(url, currentBody, { headers });
    const { succeeded, failed } = parseBatchResponse(response);
    allSucceeded.push(...succeeded);

    const retryable = failed.filter(isRetryable);
    const permanent = failed.filter((f) => !isRetryable(f));
    allFailed.push(...permanent);

    if (retryable.length === 0) break;

    if (attempt === maxRetries) {
      allFailed.push(...retryable);
      break;
    }

    console.log(
      `Batch update: retrying ${retryable.length} rate-limited event(s), attempt ${attempt + 1}/${maxRetries}`
    );

    const requestsById = extractBatchParts(currentBody, currentBoundary);
    currentBoundary = "batch_" + Math.random().toString(36).substring(2, 15);
    currentBody = buildRetryBatchBody(
      requestsById,
      retryable.map((f) => f.id),
      currentBoundary
    );

    // Google's usageLimits rate-limit windows commonly run ~100s; cap growth at 32s
    // per attempt so 7 attempts can accumulate enough total wait to ride one out.
    const delayMs = Math.min(1000 * 2 ** attempt, 32000) + Math.random() * 250;
    await sleep(delayMs);
  }

  return { succeeded: allSucceeded, failed: allFailed };
}

const app = express();
const compiler = webpack(webpackConfig);

app.use(express.json({ limit: '10mb'}));
app.use(cors());
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  }),
);
app.use(webpackHotMiddleware(compiler));
app.use(express.static("public"));
app.use("/downloads", express.static(path.join(__dirname, "downloads")));

app.get("/api/check-download", async (req, res) => {
  const selectedUrl = req.query.url;

  if (!selectedUrl) {
    return res.status(400).json({ error: "Missing selected semester URL" });
  }

  try {
    // Attempt to scrape the table first
    console.log("Attempting to scrape table for URL:", selectedUrl);
    const data = await scrapeTable(selectedUrl);
    return res.status(200).json({ status: "success", method: "scrapeTable", data: data });
  } catch (scrapeError) {
    console.error("Error in scrapeTable:", scrapeError);
    console.log("Falling back to Puppeteer for URL:", selectedUrl);

    try {
      // Fallback to Puppeteer if scrapeTable fails
      await runPuppeteer(selectedUrl);
      return res.status(200).json({ status: "success", method: "runPuppeteer" });
    } catch (puppeteerError) {
      console.error("Error in runPuppeteer:", puppeteerError);
      return res.status(500).json({
        error: "Failed to retrieve data using both methods",
        details: puppeteerError.message,
      });
    }
  }
});

// Endpoint to check for token and redirect to OAuth2 flow if missing
app.get("/api/check-token", validateAndRefreshToken, async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId || typeof userId !== "string") {
      console.warn("Invalid or missing user ID cookie");
      res.clearCookie("userId");
      return res.status(200).json({ authUrl: getAuthUrl() }); // Redirect to OAuth2 flow
    }

    const tokens = await getTokens(userId);
    if (!tokens) {
      console.warn(`No tokens found for user ID: ${userId}`);
      res.clearCookie("userId");
      return res.status(200).json({ authUrl: getAuthUrl() }); // Redirect to OAuth2 flow
    }

    oAuth2Client.setCredentials(tokens);

    // Check if the token is still valid
    await oAuth2Client.getAccessToken(); // Throws an error if invalid
    res.status(200).json({ valid: true });
  } catch (error) {
    if (error.message === "Database connection failed") {
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal server error. Please try again later." });
    } else {
      console.error("Error checking token:", error);
      res.status(200).json({ authUrl: getAuthUrl() }); // Redirect to OAuth2 flow if invalid
    }
  }
});
// server.js

app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;

  if (code) {
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      if (!tokens.refresh_token) {
        console.warn("Missing refresh_token. Redirecting to reauthorize.");
        return res.redirect("/auth");
      }

      // Fetch user info from Google
      const oauth2 = google.oauth2({ version: "v2", auth: oAuth2Client });
      const userInfo = await oauth2.userinfo.get();
      const userId = userInfo.data.id;
      const provider = "google";
      const email = userInfo.data.email;

      // Save tokens to the database
      await saveTokens(userId, provider, email, tokens);
      res.cookie("userId", userId, { httpOnly: false, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
      res.redirect("http://localhost:3000");
    } catch (error) {
      console.error("Error retrieving access token or user info:", error);
      res.status(500).send("Authentication failed. Please try again.");
    }
  } else {
    res.status(400).send("No authorization code provided");
  }
});

// Route to start OAuth flow
app.get("/auth", (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
});

app.post("/api/create-events", validateAndRefreshToken, async (req, res) => {
  try {
    const eventObjects = req.body.events;

    const cleanedEvents = eventObjects.map((event) => {
      const cleanedRecurrence = event.recurrence.filter((rule) => rule !== "");
      return { ...event, recurrence: cleanedRecurrence };
    });

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    // Cap concurrent Calendar API calls so a large course load doesn't fire dozens
    // of simultaneous requests and trip Google's per-user rate limit.
    const eventResponses = await mapWithConcurrency(cleanedEvents, 5, async (event) => {
      const createdEvent = await calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });

      const instances = await calendar.events.instances({
        calendarId: "primary",
        eventId: createdEvent.data.id,
      });

      return { event: createdEvent.data, instances: instances.data.items };
    });

    res.status(200).json({ events: eventResponses });
  } catch (error) {
    console.error("Error creating events:", error);
    res.status(500).json({ error: "Failed to create events" });
  }
});

app.post("/api/delete-events", validateAndRefreshToken, async (req, res) => {
  try {
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    await calendar.calendars.clear({ calendarId: "primary" });

    res.status(200).json({ message: "Calendar cleared successfully" });
  } catch (error) {
    console.error("Error clearing calendar:", error);
    res.status(500).json({ error: "Failed to clear calendar" });
  }
});

app.get("/api/semesters", async (req, res) => {
  try {
    const termMenu = await getSemesters();
    res.json(termMenu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch term menu"})
  }
});

app.post("/api/update", validateAndRefreshToken, async (req, res) => {
  try {
    const { body, boundary } = req.body;

    const { succeeded, failed } = await sendCalendarBatchWithRetry(
      body,
      boundary,
      oAuth2Client.credentials.access_token
    );

    if (failed.length > 0) {
      console.error("Batch update: some event instances failed to update:", failed);
    }

    res.status(200).json({
      message: `Calendar update: ${succeeded.length} succeeded, ${failed.length} failed`,
      succeeded,
      failed,
    });
  }
catch (error) {
  console.error("Error updating calendar:", error.response?.data || error.message);
  res.status(500).json({ error: "Failed to update calendar" });
  }
});



app.get("/api/access-token", validateAndRefreshToken, async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const tokens = await getTokens(userId);
    
    if (!tokens) {
      return res.status(401).json({ error: "No tokens found" });
    }
    
    oAuth2Client.setCredentials(tokens);
    const { token } = await oAuth2Client.getAccessToken();
    
    res.status(200).json({ accessToken: token });
  } catch (error) {
    console.error("Error getting access token:", error);
    res.status(500).json({ error: "Failed to get access token" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
