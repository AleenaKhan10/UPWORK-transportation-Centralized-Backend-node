// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

// Load environment variables from .env
dotenv.config();

// Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/auth");
const callRoutes = require("./routes/calls");
const accountRoutes = require("./routes/account");

app.use("/auth", authRoutes);
app.use("/api", callRoutes);
app.use("/api", accountRoutes);

// Root
app.get("/", (req, res) => {
  res.send("✅ RingCentral API Server Running");
});

// Server listener
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
