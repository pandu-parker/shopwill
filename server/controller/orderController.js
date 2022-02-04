const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const User = require('../models/UserModel.js');
const Order = require('../models/OrderModel');
const Cart = require('../models/CartModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// @desc Add new Product to cart
// @route POST /api/cart/
// @access Private/User
const creatOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  if (orderItems && orderItems === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const newOrder = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod: paymentMethod || 'none',
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await newOrder.save();
    res.status(201).json(createdOrder);
  }
});

const makePayment = asyncHandler(async (req, res) => {
  const orderId = req.body.orderId;
  const foundOrder = await Order.findById(orderId);
  var instance = new Razorpay({
    key_id: 'rzp_test_gEQ6omf9BZnOLE',
    key_secret: 'AfYAW43OP6pdfE3WybJcamWn',
  });
  var options = {
    amount: foundOrder.totalPrice * 100, // amount in the smallest currency unit
    currency: 'INR',
    receipt: orderId,
  };
  instance.orders.create(options, async function (err, order) {
    if (!foundOrder.paymentResult) {
      foundOrder.paymentResult = {};
    }
    foundOrder.paymentResult.orderId = order.id;
    await foundOrder.save();
    res.json(order);
  });
});

const completePayment = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.body.orderId);
    if (!order) {
      throw new Error('Order not found');
    } else {
      order.paymentResult.signature = req.body.response.razorpay_signature;
      order.paymentResult.paymentId = req.body.response.razorpay_payment_id;
      await order.save();
      let body =
        order.paymentResult.orderId +
        '|' +
        req.body.response.razorpay_payment_id;
      var expectedSignature = crypto
        .createHmac('sha256', 'AfYAW43OP6pdfE3WybJcamWn')
        .update(body.toString())
        .digest('hex');
      if (expectedSignature === req.body.response.razorpay_signature) {
        order.isPaid = true;
      }
      await order.save();
      res.send(order);
      // res.json({ success: true });
    }
  } catch (error) {
    console.log(error);
    throw new Error('something went wrong');
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new Error('No user found');
  } else {
    const orders = await Order.find({ user: user.id });
    res.json(orders);
  }
});


const getOrder = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new Error('No user found');
  } else {
    const order = await Order.findById(id);
    res.json(order);
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'email name');
  res.json(orders);
});

const editOrderStatus = asyncHandler(async (req,res) => {
  const orderId = req.body.orderId;
  const order = await Order.findById(orderId);
  order.status = req.body.orderStatus;
  if(req.body.orderStatus === 'delivered') {
    order.isDelivered = true;
  }
  await order.save()
  res.json(order)
})

module.exports = {
  creatOrder,
  makePayment,
  getOrders,
  getOrder,
  getAllOrders,
  completePayment,
  editOrderStatus
};
