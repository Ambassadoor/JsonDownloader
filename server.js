// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const cors = require("cors");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackConfig = require("./webpack.config.js");
const { google } = require("googleapis");
const oAuth2Client = require("./src/oauth2client"); // Import the OAuth2 client
const getAuthUrl = require("./src/auth"); // Import the function to get the auth URL

const app = express();
const compiler = webpack(webpackConfig);
const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
const TOKEN_PATH = path.join(__dirname, "server", "config", "tokens.json");

const loadCredentials = () => {
  const tokenData = fs.readFileSync(TOKEN_PATH, "utf8");
  const tokens = JSON.parse(tokenData);
  oAuth2Client.setCredentials(tokens);
};

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
  const filePath = path.join(__dirname, "downloads", "courses.json");

  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const millisecondsElapsed = new Date() - new Date(stats.mtime);
      const hoursElapsed = millisecondsElapsed / (1000 * 60 * 60);
      if (hoursElapsed < Number(req.query.hours)) {
        return res.status(200).json({ status: "current" });
      }
    }

    exec(
      `node ${path.join(__dirname, "js", "downloader.js")}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).json({ status: "failed", message: stderr });
        }
        console.log(`stdout: ${stdout}`);
        res.status(200).json({ status: "updated" });
      },
    );
  } catch (error) {
    console.error("Error checking file:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;

  if (code) {
    try {
      // Get the token using the authorization code
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      // Save the token in the specified tokens.js file
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));

      // Redirect to your frontend or another page after successful authentication
      res.redirect("http://localhost:3000"); // Redirect to your app
    } catch (error) {
      console.error("Error retrieving access token", error);
      res.status(500).send("Authentication failed");
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

app.post("/api/create-events", async (req, res) => {
  try {
    loadCredentials(); // Load OAuth credentials
    const { eventObjects } = req.body;

    const cleanedEvents = eventObjects.map((event) => {
      // Clean recurrence rules by removing the DTSTART field
      const cleanedRecurrence = event.recurrence
        .map((rule) => (rule.startsWith("DTSTART") ? "" : rule))
        .filter((rule) => rule); // Filter out empty rules

      return {
        ...event,
        recurrence: cleanedRecurrence, // Update event with cleaned recurrence rules
      };
    });

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    // Create each event and retrieve instances
    const eventResponses = await Promise.all(
      cleanedEvents.map(async (event) => {
        const createdEvent = await calendar.events.insert({
          calendarId: "primary",
          resource: event,
        });

        // Retrieve instances of the created event
        const instances = await calendar.events.instances({
          calendarId: "primary",
          eventId: createdEvent.data.id, // Use the event ID from the created event
        });

        return {
          event: createdEvent.data,
          instances: instances.data.items, // Capture the instances
        };
      }),
    );

    // Send back all created events and their instances
    res.status(200).json({
      events: eventResponses, // Send back the entire array of events and instances
    });
  } catch (error) {
    console.error("Error creating events:", error);
    res.status(500).json({ error: "Failed to create events" });
  }
});

app.post("/api/delete-events", async (req, res) => {
  try {
    loadCredentials(); // Load OAuth credentials
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    // Clear the primary calendar
    await calendar.calendars.clear({
      calendarId: "primary",
    });

    res.status(200).json({ message: "Calendar cleared successfully" });
  } catch (error) {
    console.error("Error clearing calendar:", error);
    res.status(500).json({ error: "Failed to clear calendar" });
  }
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
