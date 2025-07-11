// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./database/dbConnection");

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
const driverReportsRoutes = require("./routes/reports");

app.use("/auth", authRoutes);
app.use("/api", callRoutes);
app.use("/api", accountRoutes);
app.use("/api", driverReportsRoutes);

// Root
app.get("/", (req, res) => {
  res.send("✅ RingCentral API Server Running");
});

// Test DB connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected ✅"))
  .catch((err) => console.error("DB connection error ❌:", err));

// Server listener
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
