const express = require('express');
const router = express.Router();
const db = require('../configs/dbCon.js'); //require if needed:
const path = require('path');
const fs = require('fs');
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
    fs.readFile(path.join(__dirname, '..') + '/pages/template.html', 'utf8', (err, template) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error reading template');
        }
    
        // Read the content file (replace 'content.html' with your actual content file name)
        fs.readFile(path.join(__dirname, '..') + '/pages/home.html', 'utf8', (err, content) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error reading content');
          }

          // Replace the placeholder with the content
          const finalHtml = template.replace(/<div id="main-content"><\/div>/, content);
    
          res.status(200).send(finalHtml);
        });
      });
    
   // res.status(200).sendFile(path.join(__dirname, '../pages', 'home.html')); 
}); 

module.exports = router;