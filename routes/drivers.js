const express = require("express");
const {
  getAllDrivers,
  createDriver,
  getAllDriverDetails,
} = require("../controllers/driverController");

const router = express.Router();

router.get("/drivers", getAllDrivers);
router.get("/driver/:id", getAllDriverDetails);
router.post("/drivers", createDriver);

module.exports = router;
