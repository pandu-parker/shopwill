const express = require('express');

const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleWare');
const orderController = require('../controller/orderController');

router
  .route('/')
  .get(authMiddleWare.isAuth, orderController.getOrders)
  .post(authMiddleWare.isAuth, orderController.creatOrder);

router.route('/all').get(authMiddleWare.isAdmin, orderController.getAllOrders);

router
  .route('/pay')
  .post(authMiddleWare.isAuth, orderController.makePayment)
  .put(authMiddleWare.isAuth, orderController.completePayment);

module.exports = router;
