const mongoose = require('mongoose');

const HSNSchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
    unique: true
  },
  cgst: {
    type: Number,
    required: false,
  },
  sgst: {
    type: Number,
    required: false,
  },
  igst: {
    type: Number,
    required: false,
  },
});

const HSN = mongoose.model('HSN', HSNSchema);
module.exports = HSN;
