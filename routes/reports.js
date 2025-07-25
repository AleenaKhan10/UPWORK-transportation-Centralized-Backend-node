const express = require("express");
const {
  getAllDriverReports,
  getDriverMoriningReports,
} = require("../controllers/driverReportsController");
const router = express.Router();

router.get("/driver-reports", getAllDriverReports);
router.get("/morning-reports", getDriverMoriningReports);

module.exports = router;
