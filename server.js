
const express = require('express'); //require to utilize expressJS server
require('dotenv').config(); //require to utilize .env key/value pairs
const path = require('path');  //require to retrieve directory path

require('express-static'); //require to use static files/assets within the project

const app = express();  //creating a new instance of expressJS server
const router = require('./routes/route.config.js'); //require to connect router which is seen on route.config.js 
const errorInterceptor = require('./middleware/errors.js'); //require for middleware (ensure unregistered routes are redirected to 404 page as fallback)
const session = require('express-session'); //require to store user session 

const imagePath = path.join(__dirname, '/uploads'); //root directory of uploads
const bootstrapPath = path.join(__dirname, '/node_modules/bootstrap'); //root directory of bootstrap 
const bootstrapIconsPath = path.join(__dirname, '/node_modules/bootstrap-icons');//root directory of bootstrap icons
const jQueryPath = path.join(__dirname, '/node_modules/jquery'); //root directory of jquery
const scriptsPath = path.join(__dirname, '/pages/scripts'); //root directory of custom js scripts for frontend

/**
 * using express-static library so we can access the static files of the project,
 * Setup the url by default based on their folder path
 */
app.use('/uploads', express.static(imagePath));
app.use('/bootstrap', express.static(bootstrapPath));
app.use('/bootstrap-icons', express.static(bootstrapIconsPath));
app.use('/jquery', express.static(jQueryPath));
app.use('/scripts', express.static(scriptsPath));

/**
 * As you can see, the app will "use" the session, this is to simply 
 * notify the server that it will be a stateful application. Context of user
 * can be accessed via session.
 */
app.use(session({
    secret: process.env.APP_SECRET, 
    resave: false,
    saveUninitialized: false
  }));
/**
 * use app.use() if you want to connect modules to the express server.
 * In this case, I am using the router file and add the url '/' as the entry point on access...
 */
app.use('/', router);

/**
 * Declare this at the very bottom before the bootstrapping:
 * Reason: javascript reads the code from top to bottom, any URL that is not found will be included in the 
 *  "*" wild card, this just means that you are targeting all of the URL not defined and throwing an error with status 404 (not found)
 */
app.all('*', (req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
})
/**
 * Declare this after the app.all() method
 * Reason: so that routes and errors are processed first, before being intercepted.
 */
app.use(errorInterceptor);

//boostraps the server, run via npm run start or npm run dev for development purposes
app.listen(process.env.APP_PORT, (error) => { 
    if(!error) {
        console.log("Server is Successfully Running, and App is listening on port " + process.env.APP_PORT) 
    }
    else 
        console.log("Error occurred, server can't start", error); 
    } 
); 