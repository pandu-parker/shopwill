const express = require('express');

const router = express.Router();

const ImageController = require('../controller/imageGalleryController')

router.route('/').get(ImageController.getImages);

module.exports = router;
