const { Pool } = require("pg");

const pool = new Pool({
  user: "Ambassadoor",
  host: "localhost",
  database: "json_downloader",
  password: "ambassadoor",
  port: 5432, // Default PostgreSQL port
});

// Save tokens to the database
const saveTokens = async (userId, provider, email, tokens) => {
  const { access_token, refresh_token, scope, token_type, expiry_date } = tokens;

  console.log("Saving tokens for user:", userId); // Debugging log
  console.log("Tokens:", tokens); // Debugging log

  if (!refresh_token) {
    console.warn(`No refresh_token provided for user: ${userId}`);
    throw new Error("Missing refresh_token. Please reauthorize the application.");
  }

  const query = `
    INSERT INTO user_tokens (user_id, access_token, refresh_token, scope, token_type, expiry_date, provider, email)
    VALUES ($1, $2, $3, $4, $5, to_timestamp($6 / 1000.0), $7, $8)
    ON CONFLICT (user_id) DO UPDATE
    SET access_token = $2, refresh_token = $3, scope = $4, token_type = $5, expiry_date = to_timestamp($6 / 1000.0), provider = $7, email = $8;
  `;

  await pool.query(query, [userId, access_token, refresh_token, scope, token_type, expiry_date, provider, email]);
};
// Retrieve tokens from the database
const getTokens = async (userId) => {
  try {
    const result = await pool.query("SELECT * FROM user_tokens WHERE user_id = $1", [userId]);
    return result.rows[0];
  } catch (error) {
    console.error("Database error while retrieving tokens:", error);
    throw new Error("Database connection failed");
  }
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