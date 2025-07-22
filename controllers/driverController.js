// controllers/driverController.js
const Driver = require("../models/Driver");

const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.findAll();

    // const formattedDrivers = drivers
    //   .map((driver) => {
    //     const raw = driver?.driver_data;
    //     if (!raw || typeof raw !== "string") return null;

    //     const parsed = raw.split(",").map((val) => {
    //       if (val === "null" || val.trim() === "") return null;
    //       return val.trim();
    //     });

    //     return {
    //       driverId: driver.driverId,
    //       firstName: parsed[2],
    //       lastName: parsed[3],
    //       phone: parsed[5],
    //       email: parsed[6],
    //       company: parsed[9],
    //       status: parsed[1],
    //       hiredDate: parsed[7],
    //       lastUpdate: parsed[8],
    //       driverCallingInfor: driver.driverCallingInfor,
    //     };
    //   })
    //   .filter((d) => d !== null);

    res.json({
      success: true,
      total: drivers.length,
      data: drivers,
    });
  } catch (error) {
    console.error("❌ Error fetching drivers:", error);
    res.status(500).json({ success: false, error: "Failed to fetch drivers" });
  }
};

module.exports = {
  getAllDrivers,
};
