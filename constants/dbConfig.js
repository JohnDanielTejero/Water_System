require('dotenv').config();

/**
 * DO NOT MODIFY:
 * This module simply exports the constructor
 * for the MySQL instance which will be found on
 * @link dbCon.js
 */
module.exports = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA, 
  };