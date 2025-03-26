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

db.masterRoles = require('./masterRole')(sequelize, Sequelize);
db.masterPermissions = require('./masterPermission')(sequelize, Sequelize);
db.masterTreatments = require("../models/masterTreatment")(sequelize, Sequelize);
db.masterTests = require("../models/masterTest")(sequelize, Sequelize);
db.schools = require("./school")(sequelize,Sequelize);
db.clients = require('./client')(sequelize, Sequelize);
db.appointments = require("./appointment")(sequelize, Sequelize);
db.employees = require('./employee')(sequelize, Sequelize);
db.clients = require('./client')(sequelize, Sequelize);
db.clientAssessments = require('./clientassessment')(sequelize, Sequelize);
db.treatmentPlans = require('./treatmentplan')(sequelize, Sequelize);
// db.treatmentProgress = require('./treatmentprogress')(sequelize, Sequelize);
db.targetedBehaviors = require('./targetedbehavior')(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
