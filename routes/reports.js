const express = require("express");
const {
  getAllDriverReports,
} = require("../controllers/driverReportsController");
const router = express.Router();

router.get("/driver-reports", getAllDriverReports);

module.exports = router;
