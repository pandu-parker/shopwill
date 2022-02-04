const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
  path: {
    type: String,
    required: true,
  }
});

const Admin = mongoose.model('Image', ImageSchema);
module.exports = Admin;
