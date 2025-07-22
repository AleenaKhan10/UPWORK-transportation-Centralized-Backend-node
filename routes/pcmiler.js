const express = require("express");
const router = express.Router();
const { getETA } = require("../controllers/pcmilerController");

router.post("/eta", getETA);

module.exports = router;
