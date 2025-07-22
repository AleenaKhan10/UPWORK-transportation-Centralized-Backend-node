// models/DriverReport.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/dbConnection");

const DriverReport = sequelize.define(
  "DriverReport",
  {
    tripId: DataTypes.STRING,
    dispatcherName: DataTypes.STRING,
    driverIdPrimary: DataTypes.STRING,
    driverIdSecondary: DataTypes.STRING,
    Calculation: DataTypes.STRING,
    onTimeStatus: DataTypes.STRING,
    eta: DataTypes.STRING, // changed from DATE
    pickupTime: DataTypes.STRING, // changed from DATE
    deliveryTime: DataTypes.STRING, // changed from DATE
    milesRemaining: DataTypes.DECIMAL(10, 2),
    gpsSpeed: DataTypes.DECIMAL(10, 2),
    currentLocation: DataTypes.STRING,
    destinationCity: DataTypes.STRING,
    destinationState: DataTypes.STRING,
    etaNotes: DataTypes.TEXT,
    loadingCity: DataTypes.STRING,
    loadingState: DataTypes.STRING,
    arrivedLoading: DataTypes.STRING,
    departedLoading: DataTypes.STRING,
    arrivedDelivery: DataTypes.STRING,
    leftDelivery: DataTypes.STRING,
    deliveryLateAfterTime: DataTypes.STRING,
    tripStatusText: DataTypes.INTEGER,
    subStatus: DataTypes.INTEGER,
    driverFeeling: DataTypes.STRING,
    driverName: DataTypes.STRING,
    onTime: DataTypes.STRING,
    driverETAfeedback: DataTypes.TEXT,
    delayReason: DataTypes.TEXT,
    additionalDriverNotes: DataTypes.TEXT,
    slackPosted: DataTypes.STRING,
    callStatus: DataTypes.STRING,
    reportDate: DataTypes.STRING,
  },
  {
    tableName: "driver_reports",
    timestamps: true,
  }
);

module.exports = DriverReport;
