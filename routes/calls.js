// routes/calls.js
const express = require("express");
const router = express.Router();
const {
  makeCall,
  transferCall,
  listActiveCalls,
  listRecentCalls,
} = require("../controllers/callController");

router.post("/make-call", makeCall);
router.post("/transfer-call", transferCall);
router.get("/active-calls", listActiveCalls);
router.get("/recent-calls", listRecentCalls);

module.exports = router;
