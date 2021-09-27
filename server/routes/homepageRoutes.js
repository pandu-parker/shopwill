const express = require('express');

const router = express.Router();

const homepageRoutes = require('../controller/homepageController')

router.route('/banner').get(homepageRoutes.getBanners).post(homepageRoutes.addBanner).put(homepageRoutes.editBanner)

module.exports = router;
