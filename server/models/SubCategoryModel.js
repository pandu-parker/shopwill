const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category"
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  minorCategory: [
    {
      name: { type: String, required: true },
    },
  ],
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
