// routes/calls.js
const express = require("express");
const router = express.Router();
const {
  makeCall,
  transferCall,
  listActiveCalls,
  listRecentCalls,
  callRecordings,
  makeCallsToMultipleDrivers,
  makeVapiCall,
  updateDriverCallInsights,
} = require("../controllers/callController");

router.post("/make-call", makeCall);
router.get("/drivers-call", makeCallsToMultipleDrivers);
router.post("/transfer-call", transferCall);
router.get("/active-calls", listActiveCalls);
router.get("/recent-calls", listRecentCalls);
router.get("/recordings", callRecordings);
router.post("/vapi-call/:driverId", makeVapiCall);

router.post("/update-reports-insights", updateDriverCallInsights);

module.exports = router;
