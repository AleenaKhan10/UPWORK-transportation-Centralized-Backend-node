// controllers/authController.js
const { getPlatform } = require("../utils/ringcentral");
const { saveToken } = require("../utils/tokenManager");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const TOKEN_PATH = path.join(__dirname, "../storage/token.json");

/**
 * Redirects user to RingCentral login page
 */
const login = (req, res) => {
  try {
    const platform = getPlatform();

    const authUrl = platform.loginUrl({
      redirectUri: process.env.RC_REDIRECT_URI,
    });

    console.log("🔗 Redirecting to login URL:", authUrl);
    res.redirect(authUrl);
  } catch (err) {
    console.error("❌ Error during login redirect:", err);
    res.status(500).send("Failed to initiate login.");
  }
};

/**
 * OAuth callback to handle RingCentral response
 */
const callback = async (req, res) => {
  const authCode = req.query.code;

  try {
    if (!authCode) throw new Error("Missing auth code");

    console.log("🔁 Callback received with code:", authCode);

    const tokenUrl = `${process.env.RC_SERVER}/restapi/oauth/token`;

    const credentials = Buffer.from(
      `${process.env.RC_CLIENT_ID}:${process.env.RC_CLIENT_SECRET}`
    ).toString("base64");

    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: "authorization_code",
        code: authCode,
        redirect_uri: process.env.RC_REDIRECT_URI,
      }).toString(),
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const tokenData = response.data;
    console.log("✅ Token response:", tokenData);

    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData, null, 2));
    res.send("✅ Login successful. Token saved.");
  } catch (err) {
    console.error("❌ Login failed:", err?.response?.data || err.message);
    res
      .status(500)
      .send(
        "❌ Login failed: " +
          (err?.response?.data?.error_description || err.message)
      );
  }
};

/**
 * Logs the user out by revoking the token and clearing local storage
 */
const logout = async (req, res) => {
  try {
    console.log("LOG OUT");

    const platform = getPlatform();

    // Check if there's a valid token to revoke
    const tokenData = await platform.auth().data();
    console.log("token data ", tokenData);

    if (!tokenData || !tokenData.access_token) {
      console.warn("⚠️ No token found in platform to revoke.");
    } else {
      console.log("🔓 Logging out with token:", tokenData.access_token);
      await platform.logout(); // Revoke token
    }

    // Remove token.json if it exists
    if (fs.existsSync(TOKEN_PATH)) {
      fs.unlinkSync(TOKEN_PATH);
      console.log("🧹 Token file removed successfully.");
    } else {
      console.warn("⚠️ No token.json file to delete.");
    }

    res.send("🚪 Logged out successfully.");
  } catch (err) {
    console.error("❌ Logout failed:", err?.message || err);
    res.status(500).send("❌ Logout failed");
  }
};

module.exports = {
  login,
  callback,
  logout,
};
