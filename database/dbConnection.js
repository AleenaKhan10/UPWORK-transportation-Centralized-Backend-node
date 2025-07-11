// dbConnection.js
require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.NODE_DATABASE_NAME,
  process.env.NODE_DATABASE_USER,
  process.env.NODE_DATABASE_PASSWORD,
  {
    host: process.env.NODE_DATABASE_HOST,
    dialect: "mysql",
    logging: false, // set true if you want SQL queries in console
  }
);

module.exports = sequelize;
