const asyncHandler = require('express-async-handler');
const Product = require('../models/ProductModel.js');

//@desc GET if SKU is available
//@route GET /api/products/sku?=query
//@access Private//Admin
const skuExists = asyncHandler(async value => {
  const skuInUse = await Product.findOne({ sku: value });
  if (skuInUse) {
    return false;
  } else {
    return true;
  }
});

module.exports = skuExists;
