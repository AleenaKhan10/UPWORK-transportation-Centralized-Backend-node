// controllers/callController.js
const Driver = require("../models/Driver");
const DriverReport = require("../models/DriverReport");
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
    // return res.json(await response.json());

    const callData = await response.json();
    const callId = callData.id;

    console.log("📞 RingOut initiated. Call ID:", callId);

    // ⏳ Poll for call status
    const statusResult = await pollRingOutStatus(platform, callId);

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
 * Make calls to multiple drivers based on filtered report conditions
 */
const makeCallsToMultipleDrivers = async (req, res) => {
  try {
    const platform = getPlatform(); // Your RingCentral platform instance
    await ensureValidToken(platform); // Refresh token if needed

    const reports = await DriverReport.findAll();
    const drivers = await Driver.findAll();

    // Step 1: Filter driver reports
    const filteredReports = reports.filter((report) => {
      return (
        [1, 3, 5].includes(Number(report.subStatus)) &&
        parseFloat(report.gpsSpeed) > 5
      );
    });

    // Step 2: Match drivers with filtered reports
    const matchedDrivers = filteredReports
      .map((report) => {
        const driver = drivers.find(
          (d) => d.driverId === report.driverIdPrimary
        );
        return driver ? { ...driver.toJSON(), report } : null;
      })
      .filter(Boolean);

    return res.send(matchedDrivers);

    // Step 3: Make calls
    const results = [];

    for (const driver of matchedDrivers) {
      try {
        const response = await platform.post(
          "/restapi/v1.0/account/~/extension/~/ring-out",
          {
            from: { phoneNumber: "317-559-2104" }, // your RingCentral number
            to: { phoneNumber: driver.phoneNumber },
            playPrompt: false,
          }
        );

        const callData = await response.json();

        console.log(
          `📞 Call initiated to ${driver.firstName} (${driver.phoneNumber})`
        );

        results.push({
          driverId: driver.driverId,
          phoneNumber: driver.phoneNumber,
          callId: callData.id,
          status: "Call initiated",
        });
      } catch (callErr) {
        console.error(
          `❌ Failed to call ${driver.phoneNumber}:`,
          callErr.message
        );
        results.push({
          driverId: driver.driverId,
          phoneNumber: driver.phoneNumber,
          status: "Call failed",
          error: callErr.message,
        });
      }
    }

    res.json({
      success: true,
      totalCallsAttempted: results.length,
      callResults: results,
    });
  } catch (err) {
    console.error("❌ Error in makeCallsToMultipleDrivers:", err.message);
    res.status(500).json({ success: false, error: err.message });
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
      query: { perPage: 20, view: "Detailed" },
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

/**
 * call recordings
 */

const callRecordings = async (req, res) => {
  try {
    const platform = getPlatform();
    const response = await platform.get(
      "/restapi/v1.0/account/~/recording/3107630740040"
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
  callRecordings,
  makeCallsToMultipleDrivers,
};
