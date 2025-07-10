// utils/tokenManager.js
const fs = require("fs");
const path = require("path");

const TOKEN_PATH = path.join(__dirname, "../storage/token.json");

const saveToken = async (platform) => {
  const tokenData = await platform.auth().data();
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData, null, 2));
  console.log("💾 Token saved to storage/token.json");
};

const loadToken = (platform) => {
  if (fs.existsSync(TOKEN_PATH)) {
    const tokenData = JSON.parse(fs.readFileSync(TOKEN_PATH));
    platform.auth().setData(tokenData);
    console.log("✅ Token loaded into platform");
  } else {
    console.warn("⚠️ No token file found");
  }
};

const ensureValidToken = async (platform) => {
  if (!platform.auth().accessTokenValid()) {
    console.log("🔁 Refreshing expired token...");
    await platform.refresh();
    await saveToken(platform);
  }
};

module.exports = {
  saveToken,
  loadToken,
  ensureValidToken,
};
