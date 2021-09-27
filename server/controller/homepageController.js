const asyncHandler = require('express-async-handler');
const Banner = require('../models/BannerModel');
const SubCategory = require('../models/SubCategoryModel.js');

// @desc GET All Banners
// @route POST /api/homepage/banner
// @access Public
const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({});
  res.json(banners);
});

// @desc Add New Banner
// @route POST /api/category/
// @access Private/Admin ??
const addBanner = asyncHandler(async (req, res) => {
  let { image, name, space } = req.body;
  const banner = await Banner.create({ image, name, space });
  res.json(banner);
});

// @desc Edit Banner
// @route POST /api/category/
// @access Private/Admin ??
const editBanner = asyncHandler(async (req, res) => {
  let { image, name, space, link } = req.body;
  const banner = await Banner.findOne({ space });
  banner.image = image;
  banner.name = name;
  banner.link = link;
  const updatedBanner = await banner.save();
  console.log(updatedBanner);
  res.json({ message: 'Edit successful' });
});

module.exports = { addBanner, getBanners, editBanner };
