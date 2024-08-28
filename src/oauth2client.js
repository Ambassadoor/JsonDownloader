// src/oauth2client.js

const { google } = require("googleapis");
const fs = require("fs");

// Load client secrets from a local file
const credentials = JSON.parse(
  fs.readFileSync("../jsondownloader/server/config/credentials.json"),
);

// Configure the OAuth2 client
const { client_id, client_secret, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[1],
);

module.exports = oAuth2Client;
