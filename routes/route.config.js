const express = require('express'); //require to access express.Router()
const router = express.Router(); //creates a router instance

const adminRoute = require('./adminRoute.js'); //retrieves js file created for routing admin
const publicRoute = require('./publicRoute.js'); //retrieves js file created for routing public

/**
 * Notice here we require the router instance to use the Js file we require.
 * This will ensure that this is connected to server.js
 */
router.use('/admin', adminRoute);
router.use('/', publicRoute);

module.exports = router;