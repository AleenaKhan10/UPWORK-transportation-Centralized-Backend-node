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

const createDriver = async (req, res) => {
  try {
    const driverData = req.body;
    
    // Generate a unique driver ID
    const timestamp = Date.now();
    const driverId = `DRV_${timestamp}`;
    
    const newDriver = await Driver.create({
      driverId,
      status: driverData.status || "Active",
      firstName: driverData.firstName,
      lastName: driverData.lastName,
      truckId: driverData.truckId || null,
      phoneNumber: driverData.phoneNumber,
      email: driverData.email || null,
      hiredOn: driverData.hiredOn || new Date().toISOString(),
      updatedOn: new Date().toISOString(),
      companyId: driverData.companyId || "COMP_001",
      dispatcher: driverData.dispatcher || null,
      firstLanguage: driverData.firstLanguage || "English",
      secondLanguage: driverData.secondLanguage || null,
      globalDnd: driverData.globalDnd || false,
      safetyCall: driverData.safetyCall || true,
      safetyMessage: driverData.safetyMessage || true,
      hosSupport: driverData.hosSupport || true,
      maintainanceCall: driverData.maintainanceCall || true,
      maintainanceMessage: driverData.maintainanceMessage || true,
      dispatchCall: driverData.dispatchCall || true,
      dispatchMessage: driverData.dispatchMessage || true,
      accountCall: driverData.accountCall || true,
      accountMessage: driverData.accountMessage || true,
      telegramId: driverData.telegramId || null,
    });

    res.status(201).json({
      success: true,
      message: "Driver created successfully",
      data: newDriver,
    });
  } catch (error) {
    console.error("❌ Error creating driver:", error);
    res.status(500).json({ success: false, error: "Failed to create driver" });
  }
};

module.exports = {
  getAllDrivers,
  createDriver,
};
