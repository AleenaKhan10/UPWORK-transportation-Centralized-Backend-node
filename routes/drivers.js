const express = require("express");
const { getAllDrivers, createDriver } = require("../controllers/driverController");

const router = express.Router();

router.get("/drivers", getAllDrivers);
router.post("/drivers", createDriver);

module.exports = router;
