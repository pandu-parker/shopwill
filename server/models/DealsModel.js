const mongoose = require('mongoose');

const dealsSchema = mongoose.Schema({
  show: {
    type: Boolean,
    required: true,
    default: false,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
});

const Deal = mongoose.model('Deal', dealsSchema);

module.exports = Deal;
