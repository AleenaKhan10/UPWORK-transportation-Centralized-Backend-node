// controllers/callController.js
const Driver = require("../models/Driver");
const DriverReport = require("../models/DriverReport");
const { pollRingOutStatus } = require("../utils/poll");
const { getPlatform } = require("../utils/ringcentral");
const { ensureValidToken } = require("../utils/tokenManager");
const { createVapiCall } = require("../utils/vapiClient");

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

/**
 * Initiates a VAPI AI-powered call to a specific driver
 * @param {Object} req - Express request object with driverId parameter
 * @param {Object} res - Express response object
 */
const makeVapiCall = async (req, res) => {
  try {
    const { driverId } = req.params;

    if (!driverId) {
      return res.status(400).json({
        error: "Driver ID is required",
        status: "validation_error",
      });
    }

    // Retrieve driver information using existing Sequelize pattern
    const driver = await Driver.findByPk(driverId);

    if (!driver) {
      return res.status(404).json({
        error: "Driver not found",
        status: "driver_not_found",
      });
    }

    // Validate driver has phone number
    if (!driver.phoneNumber) {
      return res.status(400).json({
        error: "Driver phone number is required for VAPI call",
        status: "missing_phone_number",
      });
    }

    console.log(
      `📞 Initiating VAPI call to driver: ${driver.firstName} ${driver.lastName} (${driverId})`
    );

    // Make VAPI API call with driver data
    const vapiResult = await createVapiCall(driver.toJSON());

    // Return success response following existing patterns
    res.json({
      success: true,
      callId: vapiResult.callId,
      driverId: driver.driverId,
      phoneNumber: driver.phoneNumber,
      driverName: `${driver.firstName} ${driver.lastName}`,
      status: vapiResult.status,
    });
  } catch (error) {
    console.error("❌ Error making VAPI call:", error.message);

    // Handle different error types following existing patterns
    if (error.message.includes("VAPI API Error")) {
      return res.status(502).json({
        error: error.message,
        status: "vapi_api_error",
      });
    } else if (error.message.includes("Network error")) {
      return res.status(503).json({
        error: error.message,
        status: "network_error",
      });
    } else if (error.message.includes("environment variable")) {
      return res.status(500).json({
        error: "VAPI configuration error",
        status: "configuration_error",
      });
    } else {
      return res.status(500).json({
        error: error.message,
        status: "internal_error",
      });
    }
  }
};

//? GET INSIGHTS
const updateDriverCallInsights = async (req, res) => {
  try {
    const {
      driverId,
      currentLocation,
      milesRemaining,
      eta,
      onTimeStatus,
      delayReason,
      driverMood,
      preferredCallbackTime,
      wantsTextInstead,
      issueReported,
      recordingUrl,
    } = req.body;

    console.log(
      currentLocation,
      milesRemaining,
      eta,
      onTimeStatus,
      delayReason,
      driverMood,
      preferredCallbackTime,
      wantsTextInstead,
      issueReported,
      recordingUrl
    );

    const testData = {
      driverId: "007JamedBond",
      currentLocation: "Los Angles",
      eta: "12 15 AM",
      onTimeStatus: "Delayed",
      delayReason: "Heavy traffic",
      driverMood: "Happy",
      preferredCallbackTime: "25/07/2025 12 15 AM",
      wantsTextInstead: true,
      recordingUrl: "rocording.url.com",
    };

    // FIND DRIVER
    const driverIdReport = await DriverReport.findOne({
      where: { driverIdPrimary: driverId },
    });

    if (!driverIdReport)
      return res
        .status(400)
        .json({ success: false, message: "No Report Found" });

    // UPDATE REPORTS ==> futute

    const [updatedRows] = await DriverReport.update(
      {
        currentLocation,
        milesRemaining,
        eta,
        onTimeStatus,
        delayReason,
        driverMood,
        preferredCallbackTime,
        wantsTextInstead,
        issueReported,
        recordingUrl,
      },
      {
        where: { driverId },
      }
    );

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Driver report not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Driver report updated successfully.",
      data: {
        driverId,
        currentLocation,
        milesRemaining,
        eta,
        onTimeStatus,
        delayReason,
        driverMood,
        preferredCallbackTime,
        wantsTextInstead,
        issueReported,
        recordingUrl,
      },
    });
  } catch (error) {
    console.error("Error updating driver call insights:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

module.exports = {
  makeCall,
  transferCall,
  listActiveCalls,
  listRecentCalls,
  callRecordings,
  makeCallsToMultipleDrivers,
  makeVapiCall,
  updateDriverCallInsights,
};
