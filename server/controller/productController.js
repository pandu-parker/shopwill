const fs = require('fs');
const fastcsv = require('fast-csv');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Product = require('../models/ProductModel.js');
const _ = require('lodash');

//@desc Get all Products
//@route GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
  const category = req.query.category;
  const subCategory = req.query.subCategory;
  const minorCategory = req.query.minorCategory;
  const name = req.query.name;
  let query = {};
  if (category) {
    query = { category };
  } else if (subCategory) {
    query = { subCategory };
  } else if (minorCategory) {
    query = { minorCategory };
  }
  if (name) {
    query.name = new RegExp(name, 'i');
  }
  let lt = req.query.lt;
  const gt = req.query.gt;
  if (lt === 50000) {
    lt = 9999999;
  }
  if (lt) {
    query.price = { $lte: lt, $gte: gt };
  }
  // console.log('query', query);
  const categories = await Product.distinct('category', { ...query });
  const subCategories = await Product.distinct('subCategory', { ...query });
  const minorCategories = await Product.distinct('minorCategory', { ...query });
  const products = await Product.find({ ...query }).populate('images');
  res.json({
    products,
    categories: { categories, subCategories, minorCategories },
  });
});

//@desc Get all Products in a category
//@route GET /api/products
//@access Public
const searchSuggestions = asyncHandler(async (req, res) => {
  console.log(req.query);
  const products = await Product.find({
    name: { $regex: new RegExp(req.query.query, 'i') },
  })
    .limit(10)
    .populate('category');
  res.json(products);
});

//@desc Get Product Detail
//@route GET /api/products
//@access Public
const getProductDetail = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate('hsn').populate('images');
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
    addedBy: { ...addedBy },
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
    category,
    countInStock,
    name,
    images,
    brand,
    description,
    subCategory,
    minorCategory,
    hsn,
    salePrice,
    price,
    show,
    options,
    sku,
  } = req.body;

  if (product) {
    product.name = name;
    product.images = images;
    product.description = description;
    product.brand = brand;
    product.category = category;
    product.subCategory = subCategory;
    product.minorCategory = minorCategory;
    product.price = price;
    product.salePrice = salePrice;
    product.countInStock = countInStock;
    product.show = show;
    product.hsn = hsn;
    product.sku = sku;
    product.options = options;

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

//@desc GET if SKU is available
//@route GET /api/products/sku?=query
//@access Private//Admin
const checkSku = asyncHandler(async (req, res) => {
  const sku = req.query.sku;
  const skuInUse = await Product.findOne({ sku: sku });
  if (skuInUse) {
    throw new Error('SKU not available');
  } else {
    res.json({ success: true, message: 'SKU available' });
  }
});

//@desc GET if SKU is available
//@route GET /api/products/download
//@access Private//Admin
const downloadProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    var ws = fs.createWriteStream('./server/public/data.csv');
    const csvStream = fastcsv.format({ headers: true });
    csvStream.pipe(ws).on('end', () => res.send('done'));
    products.forEach(product => {
      csvStream.write({ name: product.name, price: product.price, sku: product.sku });
    })
    csvStream.end();
    res.send(ws.path)
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  addProduct,
  getProducts,
  getProductDetail,
  editProduct,
  deleteProduct,
  searchSuggestions,
  checkSku,
  downloadProducts,
};
