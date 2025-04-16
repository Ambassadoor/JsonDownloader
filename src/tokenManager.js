const { Pool } = require("pg");

const pool = new Pool({
  user: "Ambassadoor",
  host: "localhost",
  database: "json_downloader",
  password: "ambassadoor",
  port: 5432, // Default PostgreSQL port
});

// Save tokens to the database
const saveTokens = async (userId, tokens) => {
  const { access_token, refresh_token, scope, token_type, expiry_date } = tokens;

  console.log("Saving tokens for user:", userId); // Debugging log
  console.log("Tokens:", tokens); // Debugging log

  if (!refresh_token) {
    console.warn(`No refresh_token provided for user: ${userId}`);
    throw new Error("Missing refresh_token. Please reauthorize the application.");
  }

  const query = `
    INSERT INTO user_tokens (user_id, access_token, refresh_token, scope, token_type, expiry_date)
    VALUES ($1, $2, $3, $4, $5, to_timestamp($6 / 1000.0))
    ON CONFLICT (user_id) DO UPDATE
    SET access_token = $2, refresh_token = $3, scope = $4, token_type = $5, expiry_date = to_timestamp($6 / 1000.0);
  `;

  await pool.query(query, [userId, access_token, refresh_token, scope, token_type, expiry_date]);
};
// Retrieve tokens from the database
const getTokens = async (userId) => {
  console.log("Retrieving tokens for user:", userId); // Debugging log

  const query = `SELECT * FROM user_tokens WHERE user_id = $1`;
  const result = await pool.query(query, [userId]);

  if (result.rows.length === 0) {
    console.error("No tokens found for user:", userId); // Debugging log
    throw new Error("No tokens found for this user");
  }

  console.log("Tokens retrieved for user:", userId, result.rows[0]); // Debugging log
  return result.rows[0];
};
// Refresh tokens when expired
const refreshTokens = async (userId, oAuth2Client) => {
  try {
    const tokens = await getTokens(userId);
    oAuth2Client.setCredentials(tokens);

    const { credentials } = await oAuth2Client.refreshAccessToken();
    await saveTokens(userId, credentials);

    return credentials;
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    throw error;
  }
};

module.exports = { saveTokens, getTokens, refreshTokens };