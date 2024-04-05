const express = require('express');
const router = express.Router();
const db = require('../constants/dbCon.js'); //require if needed:
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

/**
 * Specify requests GET, POST and the corresponding URL
 * 
 * router.<method>(<url>, (req, res) => {
 * 
 *   
 * });
 */

//no client yet, this is unimplemented
// router.get('/', (req, res) =>{
//   if(typeof req?.session?.user == "undefined" || typeof req?.session?.user == "null"){
//     res.redirect('/login');
//     return;
//   }

//   res.status(200).send("<h1>hello</h1>");
// });

//API - retrieving current user in session
router.get('/current-user', (req, res) =>{
  res.status(200).json(req.session.user);
})

//redirects user to appropriate dashboard
router.get('/redirection', (req, res) => {
  if(typeof req?.session?.user == "undefined" || typeof req?.session?.user == "null"){
    res.status(200).redirect('/login');
    return;
  }
  if(req.session.user.username == "admin"){
    res.status(200).redirect('/admin');
    return;
  }

  res.status(200).redirect('/');
});

//renders login page
router.get('/login', (req, res) => { 
    res.set('Content-Type', 'text/html'); 
    //using file read, retrieve the file of template.html
    fs.readFile(path.join(__dirname, '..') + '/pages/template.html', 'utf8', (err, template) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error reading template');
        }
    
        //using file read, retrieve the actual file
        fs.readFile(path.join(__dirname, '..') + '/pages/login.html', 'utf8', (err, content) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error reading content');
          }

          // Replace the placeholder with the content
          const finalHtml = template.replace(/<div id="main-content"><\/div>/, content);
    
          res.status(200).send(finalHtml);
        });
    });
    
}); 

//API for login: See login.html line 46
router.post('/login', (req, res) => {
  const {username, password } = req.body;
  //bad practice, change this to using hash and comparing pass with hashed pass, but for demonstration sake we'll keep it like this
  db.query('SELECT * FROM users WHERE username = ? AND password = ?;', [username, password], (error, result) => {
    if (error) {
        console.error(error);
      } else {
        if(result.length === 0) {
          res.status(200).json({"status": "incorrect"});
          return;
        }

        req.session.user = result[0];
        res.status(200).json({"status": "success", 'user': result[0]});
      }
    })
});

//redirection to login, invalidates session
router.get('/logout', (req, res) => {
  if(typeof req.session?.user != "undefined" && typeof req?.session?.user != "null"){
    req.session.user = null;
  }
  res.status(200).redirect('/login');
});

module.exports = router;