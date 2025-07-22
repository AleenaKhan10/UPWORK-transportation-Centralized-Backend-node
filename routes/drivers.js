const express = require("express");
const { getAllDrivers } = require("../controllers/driverController");

const router = express.Router();

router.get("/drivers", getAllDrivers);

module.exports = router;
