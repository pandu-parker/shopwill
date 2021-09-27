const express = require('express');

const router = express.Router();

const adminController = require('../controller/adminController')

router.route('/').post(adminController.registerAdmin);
router.route('/login').post(adminController.authAdmin);

module.exports = router;
