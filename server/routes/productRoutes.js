const express = require('express');

const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleWare');

const productController = require('../controller/productController');

router
  .route('/')
  .get(productController.getProducts)
  .post(authMiddleWare.isAdmin, authMiddleWare.isRetailer, productController.addProduct);

router
  .route('/:id')
  .get(productController.getProductDetail)
  .put(productController.editProduct)
  .delete(productController.deleteProduct);

module.exports = router;
