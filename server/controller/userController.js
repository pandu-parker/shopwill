const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel.js');

const generateToken = require('../utils/generateToken');

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('user not found');
  }
  const match = bcrypt.compareSync(password, user.password);
  if (user && match) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: 'user',
      shippingAddresses: user.shippingAddresses,
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
  const users = await User.find({}).select('-password');
  res.json({
    users,
  });
});

// @desc create user & get token
// @route POST /api/users/
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(401);
    throw new Error('user exists');
  }
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  const user = await User.create({
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

// @desc Add new shipping address to user
// @route POST /api/users/shipping
// @access Private/User
const addShippingAddress = asyncHandler(async (req, res) => {
  const { address, city, postalCode, country } = req.body.shippingAddress;
  const user = await User.findById(req.user.id).select('shippingAddresses')
  user.shippingAddresses.push({
    address,city,postalCode,country
  })
  await user.save()
  res.send(user)
});

// @desc Delete new shipping address to user
// @route DELETE /api/users/shipping/:id
// @access Private/User
const deleteShippingAddress = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(req.user.id).select('shippingAddresses')
  const newShippingAddresses = user.shippingAddresses.filter(item => {
    return item._id.toString() !== id
  })
  user.shippingAddresses = newShippingAddresses
  await user.save()
  res.json(user)
});


module.exports = { registerUser, authUser, getAllUsers, addShippingAddress , deleteShippingAddress};
