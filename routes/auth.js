// routes/auth.js
const express = require("express");
const router = express.Router();
const { login, callback, logout } = require("../controllers/authController");

router.get("/login", login);
router.get("/logout", logout);
router.get("/callback", callback);

module.exports = router;
