// routes/account.js
const express = require("express");
const router = express.Router();
const { getAccountInfo } = require("../controllers/accountController");

router.get("/account-info", getAccountInfo);

module.exports = router;
