const express = require("express");
const { makeVapiOutboundCall } = require("../controllers/vapiAgentController");

const router = express.Router();

router.get("/vapi-calls", makeVapiOutboundCall);

module.exports = router;
