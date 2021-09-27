const express = require('express');

const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleWare');
const cartOrder = require('../controller/cartController');

router
  .route('/')
  .get(authMiddleWare.isAuth, cartOrder.getCart)
  .post(authMiddleWare.isAuth, cartOrder.addToCart)
  .delete(authMiddleWare.isAuth, cartOrder.emptyCart)
  ;

router.route('/:id').delete(authMiddleWare.isAuth, cartOrder.removeFromCart);

module.exports = router;
