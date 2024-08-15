// src/auth.js

const oAuth2Client = require("./oauth2client");
const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const getAuthUrl = () => {
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
};

module.exports = getAuthUrl;
