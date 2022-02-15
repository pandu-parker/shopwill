const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    addedBy: {
      userType: { type: String, required: true },
      userId: {
        type: String,
        required: true,
      },
    },
    name: {
      type: String,
      required: true,
    },
    images: [{
      type:  mongoose.Schema.Types.ObjectId,
      ref: 'Image',
    }],
    brand: {
      type: String,
      required: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: false,
    },
    sku : {
      type : Number,
      unique: true,
      // sparse: true
      // partialFilterExpression: {rss_id: {$ne:null}}
    },
    hsn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HSN',
    },
    minorCategory: {
      type: String,
      required: false,
    },
    description: {
      type: String,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    salePrice: {
      type: Number,
      required: false,
    },

    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
    options: [
      {
        name: {
          type: String,
          required: true,
        },
        types: [
          { name: String, price: Number, sku: { type: String, unique: true, sparse: true }, image: String },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
