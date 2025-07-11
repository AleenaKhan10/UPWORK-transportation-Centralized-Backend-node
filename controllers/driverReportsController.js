const DriverReport = require("../models/DriverReport");

const getAllDriverReports = async (req, res) => {
  try {
    const reports = await DriverReport.findAll({
      order: [["reportDate", "DESC"]],
    });

    return res.status(200).json({
      status: 200,
      message: "Driver reports fetched successfully",
      data: reports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);

    return res.status(500).json({
      status: 500,
      message: "Failed to fetch driver reports",
      data: null,
      error: error.message, // optional: include only in dev
    });
  }
};

module.exports = { getAllDriverReports };
