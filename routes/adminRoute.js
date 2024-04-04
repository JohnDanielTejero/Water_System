const express = require('express');
const router = express.Router();
const db = require('../constants/dbCon.js'); //require if needed:
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const { adminTemplate } = require('../constants/render-page.js');

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
    adminTemplate(req, res, template, 'dashboard');
  });
}); 

router.get('/sales', (req, res) => {
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
    adminTemplate(req, res, template, 'sales');
  });
});

//API
router.get('/sales_list', (req, res) => {
  db.query(`
    SELECT s.*, q.total_quantity
    FROM sales s
    INNER JOIN (
        SELECT sales_id, SUM(quantity) AS total_quantity
        FROM sales_items
        GROUP BY sales_id
    ) q ON s.id = q.sales_id
    ORDER BY unix_timestamp(s.date_created) DESC;`, 
    (err, result) => {
      if (err){
        console.error(err);
      }else{
        res.status(200).json(result);
      }
})
})

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