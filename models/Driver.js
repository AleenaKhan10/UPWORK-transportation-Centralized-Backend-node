// models/Driver.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/dbConnection");

const Driver = sequelize.define(
  "Driver",
  {
    driverId: {
      type: DataTypes.STRING(100),
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING(100),
    },
    firstName: {
      type: DataTypes.STRING(100),
    },
    lastName: {
      type: DataTypes.STRING(100),
    },
    truckId: {
      type: DataTypes.STRING(100),
    },
    phoneNumber: {
      type: DataTypes.STRING(100),
    },
    email: {
      type: DataTypes.STRING(100),
    },
    hiredOn: {
      type: DataTypes.STRING(100),
    },
    updatedOn: {
      type: DataTypes.STRING(100),
    },
    companyId: {
      type: DataTypes.STRING(100),
    },
    dispatcher: {
      type: DataTypes.STRING(100),
    },
    firstLanguage: {
      type: DataTypes.STRING(100),
    },
    secondLanguage: {
      type: DataTypes.STRING(100),
    },
    globalDnd: {
      type: DataTypes.BOOLEAN,
    },
    safetyCall: {
      type: DataTypes.BOOLEAN,
    },
    safetyMessage: {
      type: DataTypes.BOOLEAN,
    },
    hosSupport: {
      type: DataTypes.BOOLEAN,
    },
    maintainanceCall: {
      type: DataTypes.BOOLEAN,
    },
    maintainanceMessage: {
      type: DataTypes.BOOLEAN,
    },
    dispatchCall: {
      type: DataTypes.BOOLEAN,
    },
    dispatchMessage: {
      type: DataTypes.BOOLEAN,
    },
    accountCall: {
      type: DataTypes.BOOLEAN,
    },
    accountMessage: {
      type: DataTypes.BOOLEAN,
    },
    telegramId: {
      type: DataTypes.STRING(100),
    },
  },
  {
    tableName: "driversDirectory",
    timestamps: false,
  }
);

module.exports = Driver;
