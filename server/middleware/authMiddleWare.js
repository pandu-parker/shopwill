const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');
const Retailer = require('../models/RetailerModel');
const Admin = require('../models/AdminModel');

const isAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  if (!req.headers.authorization) {
    throw new Error('Not authorized');
  }
});

const isRetailer = asyncHandler(async (req, res, next) => {
  if (req.permission === 'admin') {
    next();
    return;
  }
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const retailer = await Retailer.findById(decoded.id).select('-password');
      if (!retailer) {
        throw new Error('Not authorized, token failed');
      } else {
        req.permission = 'retailer';
        req.retailer = retailer;
        next();
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  if (!req.headers.authorization) {
    throw new Error('Not authorized');
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) {
        next();
      } else {
        req.permission = 'admin';
        req.admin = admin;
        next();
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  if (!req.headers.authorization) {
    throw new Error('Not authorized');
  }
});

module.exports = { isAuth, isAdmin, isRetailer };
