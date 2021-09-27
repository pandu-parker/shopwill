const mongoose = require('mongoose');

const BannerSchema = mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  space: { type: String, required: true, unique: true },
  link: { type: String },
});

const Banner = mongoose.model('Banner', BannerSchema);

module.exports = Banner;
