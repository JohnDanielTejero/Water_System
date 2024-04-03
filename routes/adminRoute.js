const express = require('express');
const router = express.Router();
const db = require('../configs/dbCon.js'); //require if needed:
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

router.use(bodyParser.urlencoded({ extended: true }));
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
  if(typeof req?.session?.user == "undefined" || typeof req?.session?.user == "null"){
    res.redirect('/login');
    return;
  }
  fs.readFile(path.join(__dirname, '..') + '/pages/template.html', 'utf8', (err, template) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading template');
    }

    //using file read, retrieve the actual file
    fs.readFile(path.join(__dirname, '..') + '/pages/admin/index.html', 'utf8', (err, content) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error reading content');
      }

      fs.readFile(path.join(__dirname, '..') + '/pages/admin/navigation.html', 'utf8', (err, nav) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error reading content');
        }
        content = content.replace(/<div id="navigation"><\/div>/, nav);
        fs.readFile(path.join(__dirname, '..') + '/pages/admin/topnav.html', 'utf8', (err, topnav) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error reading content');
          }
          content = content.replace(/<div id="topbarnav"><\/div>/, topnav);
  
          const finalHtml = template.replace(/<div id="main-content"><\/div>/, content);
          res.status(200).send(finalHtml);
        });
      });
    })
  });
}); 

router.get('/dashboard', (req, res) => {
  res.set('Content-Type', 'text/html'); 
  res.status(200).sendFile(path.join(__dirname, '..') + '/pages/admin/dashboard.html');
});

//API
router.get('/total_sales', (req, res) => {
  const { date } = req.query;
  db.query("SELECT sum(amount) AS total FROM sales WHERE date(date_created) = ?", [date], (err, result) => {
      if (err){
        console.error(err);
      }else{
        res.status(200).json(result);
      }
  })
});
module.exports = router;