// utils/ringcentral.js
const SDK = require("@ringcentral/sdk").SDK;
const { loadToken } = require("./tokenManager");
require("dotenv").config();

const rcsdk = new SDK({
  clientId: process.env.RC_CLIENT_ID,
  clientSecret: process.env.RC_CLIENT_SECRET,
  server: process.env.RC_SERVER,
});

const platform = rcsdk.platform();

// Load token once on startup
loadToken(platform);

module.exports = {
  getPlatform: () => platform,
};
