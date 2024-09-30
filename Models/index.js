"use strict";

const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const Sequelize = require("sequelize");
const generalConfigs = require("../config/general-config");
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, "../config/db-config"))[
  "dbConfigs"
][env];
const db = {};

let sequelize;

// const setupSequelize = () => {
//   try {
if (config.use_env_variable) {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: "postgres",
    dialectOptions: config.dialectOptions,
    timezone: generalConfigs.timezone || "Asia/Calcutta",
    pool: {
      max: generalConfigs.dbPoolMax || 40,
      min: generalConfigs.dbPoolMin || 0,
      acquire: generalConfigs.dbPoolAcquire || 30000,
      idle: generalConfigs.dbPoolIdle || 10000,
    },
    logging: (msg) => logger.info(msg),
  });
} else {
  const connectionString = `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}?sslmode=require`;

  sequelize = new Sequelize(connectionString, {
    pool: {
      max: generalConfigs.dbPoolMax || 5,
      min: generalConfigs.dbPoolMin || 0,
      acquire: generalConfigs.dbPoolAcquire || 30000,
      idle: generalConfigs.dbPoolIdle || 10000,
      dialectOptions: config.dialectOptions,
    },
    //logging: msg => logger.info(msg)
  });
}
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
