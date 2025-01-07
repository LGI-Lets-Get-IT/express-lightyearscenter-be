"use strict";

const Sequelize = require("sequelize");
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

db.masterGroups = require("./master_groups")(sequelize, Sequelize);
db.masterPermissions = require("./master_permissions")(sequelize, Sequelize);
db.groupPermissions = require("./group_permissions")(sequelize, Sequelize);
db.users = require("./users")(sequelize, Sequelize);
db.userGroups = require("./user_groups")(sequelize, Sequelize);
db.userPermissions = require("./user_permissions")(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
