const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Product = require('../models/ProductModel.js');
const Deal = require('../models/DealsModel');

//@desc Get all Products
//@route GET /api/products
//@access Public
const addDeal = asyncHandler(async (req, res) => {
  const productId = req.body.product;
  const show = req.body.show;
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('product not found');
  } else {
    const deal = new Deal({
      product:productId,
      show,
    });
    await deal.save();
    res.json(deal);
  }
});

//@desc Get all Products
//@route GET /api/products
//@access Public
const getDeals = asyncHandler(async (req, res) => {
  const deals = await Deal.find({show: true}).populate('product');
  if (!deals) {
    throw new Error('deals not found');
  } else {
    res.json(deals);
  }
});


//@desc Get all Products
//@route GET /api/products
//@access Public
const getAllDeals = asyncHandler(async (req, res) => {
    const deals = await Deal.find({}).populate('product');
    if (!deals) {
      throw new Error('deals not found');
    } else {
      res.json(deals);
    }
  });

module.exports = {
  addDeal,
  getDeals,
  getAllDeals
};
