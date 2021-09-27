const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Retailer = require('../models/RetailerModel.js');

const generateToken = require('../utils/generateToken');

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await Retailer.findOne({ email });
  if(!user) {
    throw new Error('user not found')
  }
  const match = bcrypt.compareSync(password, user.password)
  if (user && match) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: 'retailer',
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('wrong credentials');
  }
});

// @desc Get all users
// @route GET /api/users/
// @access Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await Retailer.find({}).select('-password');
  res.json({
    users,
  });
});

// @desc create user & get token
// @route POST /api/users/
// @access Public
const registerRetailer = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const userExists = await Retailer.findOne({ email });
 
  if (userExists) {
    res.status(401);
    throw new Error('user exists');
  }
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  const user = await Retailer.create({
    name,
    email,
    password: hash,
    phone,
  });

  if (user) {
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      // token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

module.exports = { registerRetailer, authUser, getAllUsers };
