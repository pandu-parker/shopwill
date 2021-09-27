const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Admin = require('../models/AdminModel');

const generateToken = require('../utils/generateToken');

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await Admin.findOne({ email });
  if(!user) {
    throw new Error('user not found')
  }
  const match = bcrypt.compareSync(password, user.password)
  if (user && match) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('wrong credentials');
  }
});

// @desc create user & get token
// @route POST /api/users/
// @access Public
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const userExists = await Admin.findOne({ email });
 
  if (userExists) {
    res.status(401);
    throw new Error('user exists');
  }
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  const user = await Admin.create({
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

module.exports = { registerAdmin, authAdmin };
