const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const User = require('../models/UserModel.js');
const Product = require('../models/ProductModel.js');
const Cart = require('../models/CartModel');

// @desc Add new Product to cart
// @route POST /api/cart/
// @access Private/User
const addToCart = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const product = await Product.findById(req.body.product);
    if (!user || !product) {
      throw new Error('User or Product not found');
    } else {
      const cartExists = await Cart.findOne({ user: user.id });
      if (!cartExists) {
        //   console.log('Cart doesnt exist');
        const cart = new Cart({
          user: user.id,
          cart: [{ product: product.id, quantity: req.body.quantity || 1 }],
        });
        cart.save();
        res.json(cart);
        return;
      } else {
        const prodExists = cartExists.cart.findIndex(item => {
          return item.product == product.id;
        });
        if (prodExists >= 0) {
          // console.log('prod exists in cart', cartExists.cart[prodExists]);
          cartExists.cart[prodExists].quantity = req.body.quantity;
          await cartExists.save();
          res.json(cartExists);
        } else {
          // console.log('doesnt exist', req.body.quantity);
          const cartItem = {
            product: product.id,
            quantity: req.body.quantity || 1,
          };
          cartExists.cart.push(cartItem);
          await cartExists.save();
          res.json(cartExists);
        }
      }
    }
  } catch (error) {
    console.log(error)
    throw new Error('Something went wrong')
  }
});

// @desc Delete Product from Cart
// @route DELETE /api/cart/:id
// @access Private/User
const removeFromCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const cartId = req.params.id;
  if (!user) {
    throw new Error('User or Product not found');
  } else {
    const cartExists = await Cart.findOne({ user: user.id });
    if (!cartExists) {
      throw new Error('Cart doesnt exist');
    } else {
      const cart = cartExists.cart.filter(item => {
        return item._id.toString() !== cartId;
      });
      cartExists.cart = cart;
      await cartExists.save();
      res.json(cartExists);
    }
  }
});

// @desc Empty Cart
// @route DELETE /api/cart
// @access Private/User
const emptyCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new Error('User or Product not found');
  } else {
    const cartExists = await Cart.findOne({ user: user.id });
    if (!cartExists) {
      throw new Error('Cart doesnt exist');
    } else {
      const cart = (cartExists.cart = []);
      cartExists.cart = cart;
      await cartExists.save();
      res.json(cartExists);
    }
  }
});

// @desc Get Cart for User
// @route GET /api/cart
// @access Private/User
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new Error('User  not found');
  } else {
    const cartExists = await Cart.findOne({ user: user.id }).populate(
      'cart.product'
    );
    if (!cartExists) {
      throw new Error('Cart doesnt exist');
    } else {
      res.json(cartExists);
    }
  }
});

module.exports = { addToCart, removeFromCart, getCart, emptyCart };
