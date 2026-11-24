require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME_DEV_STAGING,
    password: process.env.DB_PASSWORD_DEV_STAGING,
    database: process.env.DB_NAME_DEVELOPMENT,
    host: process.env.DB_HOST_DEV_STAGING,
    dialect: process.env.DB_DIALECT,
    define: { aliases: false },
    pool: {
      min: 0, // min connection
      max: 5, // max connection
      acquire: 30000,
      idle: 10000,
    },
    timezone: "+07:00",
  },
  staging: {
    username: process.env.DB_USERNAME_DEV_STAGING,
    password: process.env.DB_PASSWORD_DEV_STAGING,
    database: process.env.DB_NAME_STAGING,
    host: process.env.DB_HOST_DEV_STAGING,
    dialect: process.env.DB_DIALECT,
    define: { aliases: false },
    pool: {
      min: 0, // min connection
      max: 5, // max connection
      acquire: 30000,
      idle: 10000,
    },
    timezone: "+07:00",
  },
  production: {
    username: process.env.DB_USERNAME_PRODUCTION,
    password: process.env.DB_PASSWORD_PRODUCTION,
    database: process.env.DB_NAME_PRODUCTION,
    host: process.env.DB_HOST_PRODUCTION,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
    define: { aliases: false },
    pool: {
      min: 0, // min connection
      max: 3, // max connection
      acquire: 30000,
      idle: 10000,
    },
    timezone: "+07:00",
  },
};
