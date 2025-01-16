require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
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
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
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
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    define: { aliases: false },
    pool: {
      min: 0, // min connection
      max: 1, // max connection
      acquire: 30000,
      idle: 10000,
    },
    timezone: "+07:00",
  },
};
