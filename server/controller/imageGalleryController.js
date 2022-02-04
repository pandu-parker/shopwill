const asyncHandler = require('express-async-handler');
const Image = require('../models/ImageModel.js');

// @desc Get All Categories
// @route GET /api/category/
// @access Public
const getImages = asyncHandler(async (req, res) => {
  const images = await Image.find({});
  res.json(images);
});

module.exports = { getImages };
