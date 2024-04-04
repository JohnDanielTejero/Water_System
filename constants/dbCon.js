
const mysql = require('mysql2');
const db = mysql.createPool({
  ...require('./dbConfig') // Import connection details
});

module.exports = db;