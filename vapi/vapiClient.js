const { VapiClient } = require("@vapi-ai/server-sdk");
require("dotenv").config();

const vapi = new VapiClient({
  token: process.env.VAPI_API_KEY,
});

module.exports = vapi;
