const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    GST: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('Retailer', userSchema);

module.exports = User;
