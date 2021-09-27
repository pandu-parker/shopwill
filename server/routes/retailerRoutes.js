const express = require('express');

const router = express.Router();

const retailerController = require('../controller/retailerController')

router.route('/').post(retailerController.registerRetailer);
router.route('/login').post(retailerController.authUser);

module.exports = router;
