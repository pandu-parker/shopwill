const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Product = require('../models/ProductModel.js');

//@desc Get all Products
//@route GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
  const category = req.query.category;
  const subCategory = req.query.subCategory;
  const minorCategory = req.query.minorCategory;
  let query = {};
  if (category) {
    query = { category };
  } else if (subCategory) {
    query = { subCategory };
  } else if (minorCategory) {
    query = { minorCategory };
  }
  const lt = req.query.lt;
  const gt = req.query.gt;
  if (lt) {
    query.price = { $lte: lt, $gte: gt };
  }
  console.log('query',query)
  const products = await Product.find({ ...query });
  res.json(products);
});

//@desc Get all Products in a category
//@route GET /api/products
//@access Public
const searchProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

//@desc Get Product Detail
//@route GET /api/products
//@access Public
const getProductDetail = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  res.json(product);
});

// @desc Add new Product
// @route POST /api/products/
// @access Private/Admin ??
const addProduct = asyncHandler(async (req, res) => {
  let addedBy = null;
  if (req.permission === 'retailer' && req.retailer) {
    addedBy = {
      userType: 'retailer',
      userId: req.retailer.id,
    };
  } else if (req.permission === 'admin' && req.admin) {
    addedBy = {
      userType: 'admin',
      userId: req.admin.id,
    };
  }
  if (!addedBy) {
    throw new Error('Not Authorized');
  }
  const product = new Product({
    name: 'Sample Name',
    price: 0,
    image: '/uploads/sample.jpg',
    brand: 'Sample Brand',
    category: new mongoose.Types.ObjectId(),
    countInStock: 0,
    numReviews: 0,
    description: 'Sample Description',
    addedBy: {...addedBy},
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc EDIT Product
// @route POST /api/products/:id
// @access Private/Admin ??
const editProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  const {
    name,
    image,
    brand,
    description,
    category,
    subCategory,
    minorCategory,
    countInStock,
    salePrice,
    price,
    show,
  } = req.body;
  if (product) {
    product.name = name;
    product.image = image;
    product.description = description;
    product.brand = brand;
    product.category = category;
    product.subCategory = subCategory;
    product.minorCategory = minorCategory;
    product.price = price;
    product.salePrice = salePrice;
    product.countInStock = countInStock;
    product.show = show;
    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product Not found');
  }
});

//@desc DELETE Product
//@route GET /api/products/:id
//@access Private//Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Not found');
  } else {
    await Product.deleteOne({ _id: id });
    res.json({ success: true, message: 'product deleted' });
  }
});

module.exports = {
  addProduct,
  getProducts,
  getProductDetail,
  editProduct,
  deleteProduct,
};
