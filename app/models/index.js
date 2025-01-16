"use strict";

const Sequelize = require("sequelize");
const process = require("process");
const config = require("../config/db.config")[
  process.env.NODE_ENV || "development"
];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

db.masterProductCategory = require("../models/masterproductcategory")(
  sequelize,
  Sequelize
);
db.masterProducts = require("../models/masterproducts")(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
