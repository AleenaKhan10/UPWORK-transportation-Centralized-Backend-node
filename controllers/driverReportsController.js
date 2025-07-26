const { DriverMorningReport, Driver } = require("../models");

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

const getDriverMoriningReports = async (req, res) => {
  try {
    const morning_reports = await DriverMorningReport.findAll({
      include: [
        {
          model: Driver,
          as: "driver",
        },
      ],
    });
    return res.status(200).json({
      status: 200,
      count: morning_reports.length || 0,
      message: "Morning Reports fetched successfully",
      data: morning_reports,
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

module.exports = { getAllDriverReports, getDriverMoriningReports };
