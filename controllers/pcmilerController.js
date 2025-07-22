// pcmilerController.js

const axios = require("axios");

/**
 * Calculate ETA for a truck route using PC*MILER API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getETA = async (req, res) => {
  try {
    const { origin, destination, departureTime } = req.body;

    if (!origin || !destination) {
      return res
        .status(400)
        .json({ error: "Origin and destination are required." });
    }

    const API_KEY = process.env.PCMILER_API_KEY;
    const endpoint = `https://pcmiler.alk.com/apis/rest/v1.0/Service.svc/route/routeReports`;

    const payload = {
      stops: [{ addr: origin }, { addr: destination }],
      options: {
        routeType: "Practical",
        vehicleProfile: {
          type: "Truck",
          length: 53,
          weight: 80000,
        },
        ...(departureTime && { departureTime }), // Optional
      },
    };

    const response = await axios.post(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const totalHours = response.data.totalTime;
    const baseTime = departureTime ? new Date(departureTime) : new Date();
    const eta = new Date(baseTime.getTime() + totalHours * 60 * 60 * 1000);

    res.json({
      origin,
      destination,
      distance: response.data.distance,
      travelTimeHours: totalHours,
      eta: eta.toISOString(),
    });
  } catch (err) {
    console.error("PC*MILER API Error:", err?.response?.data || err.message);
    res
      .status(500)
      .json({
        error: "Failed to calculate ETA.",
        detail: err?.response?.data || err.message,
      });
  }
};

module.exports = { getETA };
