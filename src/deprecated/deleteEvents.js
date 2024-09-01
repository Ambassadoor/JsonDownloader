const { google } = require("googleapis");
const express = require("express");
const app = express();
app.use(express.json());



const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
);
// Hardcode your tokens here for testing purposes


// Load credentials from hardcoded tokens
oauth2Client.setCredentials(tokens);

app.get("/delete-events", async (req, res) => {
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  try {
    let pageToken = null;
    let totalDeleted = 0;

    do {
      const response = await calendar.events.list({
        calendarId: "primary",
        q: "Course Code", // Adjust this query to match the keyword in the event summary or description
        singleEvents: true,
        orderBy: "startTime",
        pageToken: pageToken, // Pagination token
      });

      const events = response.data.items;
      pageToken = response.data.nextPageToken;

      if (events.length) {
        for (const event of events) {
          try {
            await calendar.events.delete({
              calendarId: "primary",
              eventId: event.id,
            });
            console.log(`Deleted event: ${event.summary}`);
            totalDeleted++;
          } catch (deleteError) {
            console.error(`Failed to delete event ${event.id}:`, deleteError);
          }
        }
      } else {
        console.log("No more events found.");
      }
    } while (pageToken);

    res.send(`Total events deleted: ${totalDeleted}`);
  } catch (error) {
    console.error("Error deleting events:", error);
    res.status(500).send(`Error deleting events: ${error.message}`);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
