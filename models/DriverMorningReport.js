// models/DriverReport.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/dbConnection");

const DriverMorningReport = sequelize.define(
  "DriverMorningReport",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tripId: DataTypes.STRING,
    dispatcherName: DataTypes.STRING,
    driverIdPrimary: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // for one-to-one with drivers
    },
    MPH: DataTypes.FLOAT,
    MilesLEFT: DataTypes.FLOAT,
    Location2: DataTypes.STRING,
    currentLocation: DataTypes.STRING,
    AI_ETA: DataTypes.DATE,
    loadingCity: DataTypes.STRING,
    loadingState: DataTypes.STRING,
    destinationCity: DataTypes.STRING,
    destinationState: DataTypes.STRING,
    pickupTime: DataTypes.DATE,
    deliveryTime: DataTypes.DATE,
    DeliveryLATEAfterTime: DataTypes.DATE,
    arrivedLoading: DataTypes.DATE,
    departedLoading: DataTypes.DATE,
    Ditat_ETA: DataTypes.DATE,
    ETA_NOTES: DataTypes.TEXT,
    arrivedDelivery: DataTypes.DATE,
    leftDelivery: DataTypes.DATE,
    tripStatusText: DataTypes.STRING,
    subStatus: DataTypes.STRING,
    driverFeeling: DataTypes.STRING,
    driverName: DataTypes.STRING,
    onTime: DataTypes.BOOLEAN,
    driverETAfeedback: DataTypes.TEXT,
    delayReason: DataTypes.TEXT,
    additionalDriverNotes: DataTypes.TEXT,
    slackPosted: DataTypes.BOOLEAN,
    callStatus: DataTypes.STRING,
    reportDate: DataTypes.DATE,
    ETA_Notes_1: DataTypes.TEXT,
    workflowTrigger: DataTypes.STRING,
    loadGroup: DataTypes.STRING,
  },
  {
    tableName: "driver_morning_report",
    timestamps: true,
  }
);

DriverMorningReport.associate = (models) => {
  DriverMorningReport.belongsTo(models.Driver, {
    foreignKey: "driverIdPrimary",
    as: "driver", // access with: driverReport.driver
  });
};

module.exports = DriverMorningReport;
