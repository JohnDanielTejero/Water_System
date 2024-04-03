const express = require('express');
const router = express.Router();
const adminRoute = require('./adminRoute.js');
const publicRoute = require('./publicRoute.js');

router.use('/admin', adminRoute);
router.use('/', publicRoute);

module.exports = router;