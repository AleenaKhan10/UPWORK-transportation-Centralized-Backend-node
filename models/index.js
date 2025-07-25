const Sequelize = require("sequelize");
const sequelize = require("../database/dbConnection");

const Driver = require("./Driver");
const DriverMorningReport = require("./DriverMorningReport");

const models = {
  Driver,
  DriverMorningReport,
};

// Attach associations
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
