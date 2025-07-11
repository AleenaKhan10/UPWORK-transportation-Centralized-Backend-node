// controllers/callController.js
const { pollRingOutStatus } = require("../utils/poll");
const { getPlatform } = require("../utils/ringcentral");
const { ensureValidToken } = require("../utils/tokenManager");

/**
 * Initiates an outbound call using RingOut API
 */
const makeCall = async (req, res) => {
  try {
    const platform = getPlatform();
    await ensureValidToken(platform);

    const response = await platform.post(
      "/restapi/v1.0/account/~/extension/~/ring-out",
      {
        from: { phoneNumber: "317-559-2104" },
        to: { phoneNumber: "(219) 200-2824" },
        playPrompt: false,
      }
    );

    const callData = await response.json();
    const callId = callData.id;

    console.log("📞 RingOut initiated. Call ID:", callId);

    // ⏳ Poll for call status
    const statusResult = await pollRingOutStatus(platform, callId);

    // res.json(await response.json());
    res.json({
      message: "Call status result",
      callId,
      ...statusResult,
    });
  } catch (err) {
    console.error("❌ Error making call:", err);
    res.status(err?.response?.status || 500).json({ error: err.message });
  }
};

/**
 * Returns a list of currently active calls
 */
const listActiveCalls = async (req, res) => {
  try {
    const platform = getPlatform();
    await ensureValidToken(platform);

    const response = await platform.get(
      "/restapi/v1.0/account/~/extension/~/active-calls"
    );

    res.json(await response.json());
  } catch (err) {
    console.error("❌ Error listing active calls:", err);
    res.status(err?.response?.status || 500).json({ error: err.message });
  }
};

/**
 * Returns a list of recent calls
 */
const listRecentCalls = async (req, res) => {
  try {
    const platform = getPlatform();
    await ensureValidToken(platform);

    const response = await platform.get("/restapi/v1.0/account/~/call-log", {
      query: { perPage: 20, view: "Simple" },
    });

    res.json(await response.json());
  } catch (err) {
    console.error("❌ Error listing recent calls:", err);
    res.status(err?.response?.status || 500).json({ error: err.message });
  }
};

/**
 * Transfers an ongoing call to another number
 */
const transferCall = async (req, res) => {
  const { sessionId, partyId, targetNumber } = req.body;
  try {
    const platform = getPlatform();
    await ensureValidToken(platform);

    const response = await platform.post(
      `/restapi/v1.0/account/~/telephony/sessions/${sessionId}/parties/${partyId}/transfer`,
      { phoneNumber: targetNumber }
    );

    res.json(await response.json());
  } catch (err) {
    console.error("❌ Error transferring call:", err);
    res.status(err?.response?.status || 500).json({ error: err.message });
  }
};

module.exports = {
  makeCall,
  transferCall,
  listActiveCalls,
  listRecentCalls,
};
