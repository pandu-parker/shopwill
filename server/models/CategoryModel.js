const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  show: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
