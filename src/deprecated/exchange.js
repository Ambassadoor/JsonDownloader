const { google } = require("googleapis");
const express = require("express");
const app = express();

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
);

app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Tokens:", tokens);
    res.send("Authentication successful! You can close this window.");
  } catch (error) {
    console.error("Error retrieving tokens:", error);
    res.status(500).send("Error retrieving tokens");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
