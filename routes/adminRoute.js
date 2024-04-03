const express = require('express');
const router = express.Router();
const db = require('../configs/dbCon.js'); //require if needed:
const path = require('path');

/**
 * Specify requests GET, POST and the corresponding URL
 * 
 * router.<method>(<url>, (req, res) => {
 * 
 *   
 * });
 */
router.get('/', (req, res) => { 
    res.set('Content-Type', 'text/html'); 
    db.query('SELECT * FROM users', (error, result) => {
        if (error) {
            // Handle error
            console.error(error);
            res.status(500).send('Error fetching users');
          } else {
            console.log(result);
              res.status(200).send(`<h1>Welcome to Admin Page!</h1> ${result}`); 
          }
    })
}); 

module.exports = router;