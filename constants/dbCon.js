/**
 * Require the driver for MySQL to nodeJS (mysql 2 is used to support 
 * mysql in v5 or later).
 */
const mysql = require('mysql2');
/**
 * Create db context which will be used to communicate in database.
 * see @link adminRoute.js and publicRoute.js for its usage.
 */
const db = mysql.createPool({
  ...require('./dbConfig') // Import connection details
});

module.exports = db;