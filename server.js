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

const app = express();
const compiler = webpack(webpackConfig);

app.use(express.json());
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
      res.cookie("userId", userId, { httpOnly: false });
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

    const eventResponses = await Promise.all(
      cleanedEvents.map(async (event) => {
        const createdEvent = await calendar.events.insert({
          calendarId: "primary",
          resource: event,
        });

        const instances = await calendar.events.instances({
          calendarId: "primary",
          eventId: createdEvent.data.id,
        });

        return { event: createdEvent.data, instances: instances.data.items };
      })
    );

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

    const url = "https://www.googleapis.com/batch/calendar/v3";
    const headers = {
      "Content-Type": `multipart/mixed; boundary="${boundary}"`,
      Authorization: `Bearer ${oAuth2Client.credentials.access_token}`,
    };
    const response = await axios.post(url, body, { headers });
    res.status(200).json({ message: "Calendar updated successfully", data: response.data });
    
  }
catch (error) {
  console.error("Error updating calendar:", error.response?.data || error.message);
  res.status(500).json({ error: "Failed to update calendar" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
