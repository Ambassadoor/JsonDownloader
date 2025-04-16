const { getTokens, refreshTokens } = require("./tokenManager");

const validateAndRefreshToken = async (req, res, next) => {
    try {
      const userId = req.headers["x-user-id"];
      if (!userId) {
        return res.status(400).json({ error: "Missing x-user-id header" });
      }
  
      let tokens = await getTokens(userId);
      oAuth2Client.setCredentials(tokens);
  
      try {
        // Check if the token is valid
        await oAuth2Client.getAccessToken();
      } catch (error) {
        if (error.message.includes("Token has expired")) {
          console.log("Refreshing expired token...");
          tokens = await refreshTokens(userId, oAuth2Client);
          oAuth2Client.setCredentials(tokens);
        } else {
          throw error;
        }
      }
  
      next();
    } catch (error) {
      console.error("Error validating or refreshing token:", error);
      res.status(401).json({ authUrl: getAuthUrl() });
    }
  };

module.exports = { validateAndRefreshToken};