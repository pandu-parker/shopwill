const asyncHandler = require('express-async-handler');
const Category = require('../models/CategoryModel.js');
const SubCategory = require('../models/SubCategoryModel.js');

// @desc Get All Categories
// @route GET /api/category/
// @access Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  const compCategories = [];
  await Promise.all(
    categories.map(async (category, index) => {
      compCategories.push({ ...category._doc });
      const subCategories = await SubCategory.find({
        parentCategory: category._id,
      });
      if (subCategories) {
        compCategories[index].subCategories = subCategories;
      }
    })
  );
  res.json(compCategories);
});

// @desc Add New Category
// @route POST /api/category/
// @access Private/Admin ??
const createCategory = asyncHandler(async (req, res) => {
  let { name } = req.body;
  name = name.toLowerCase();
  const category = await Category.findOne({ name });
  if (category) {
    res.status(400);
    res.json({
      message: 'Category Already exists',
    });
  }
  const newCategory = await Category.create({
    name,
  });
  res.json(newCategory);
});

// @desc Delete Category
// @route DELETE /api/category/:id
// @access Private/Admin ??
const deleteCategory = asyncHandler(async (req, res) => {
  let id = req.params.id;
  const category = await Category.findById(id);
  if (category) {
    await Category.deleteOne({ _id: id });
    res.json({ success: true });
  } else {
    res.status(404);
    res.json({
      message: 'Category Not Found',
    });
  }
});

// @desc Add New SubCategory
// @route POST /api/categories/subcategory
// @access Private/ Admin ??
const createSubCategory = asyncHandler(async (req, res) => {
  let { name, parentCategory } = req.body;
  name = name.toLowerCase();
  const category = await Category.findById(parentCategory);
  if (!category) {
    res.status(404);
    res.json({ message: 'Parent Category not found' });
  } else {
    const subCategory = await SubCategory.findOne({ name });
    if (subCategory) {
      res.status(400);
      res.json({
        message: 'SubCategory Already exists',
      });
    } else {
      const newSubCategory = await SubCategory.create({
        name,
        parentCategory,
      });
      res.json(newSubCategory);
    }
  }
});

// @desc Delete SubCategory
// @route DELETE /api/category/:id
// @access Private/Admin ??
const deleteSubCategory = asyncHandler(async (req, res) => {
  let id = req.params.id;
  const category = await SubCategory.findById(id);
  if (category) {
    await SubCategory.deleteOne({ _id: id });
    res.json({ success: true });
  } else {
    res.status(404);
    res.json({
      message: 'Category Not Found',
    });
  }
});
// @desc Add New MinorCategory
// @route POST /api/categories/minorcategory
// @access Private/ Admin ??
const createMinorCategory = asyncHandler(async (req, res) => {
  let { name, parentCategory } = req.body;
  name = name.toLowerCase();
  const subCategory = await SubCategory.findById(parentCategory);
  if (!subCategory) {
    res.status(404);
    res.json({ message: 'Parent SubCategory not found' });
  } else {
    const ifExists = subCategory.minorCategory.find(c => c.name === name);
    if (ifExists) {
      res.json({ message: 'Minor Category Already exists' });
    } else {
      subCategory.minorCategory.push({ name });
      await subCategory.save();
      res.status(201).json(subCategory);
    }
  }
});

// @desc Delete MinorCategory
// @route DELETE /api/categories/minorcategory
// @access Private/ Admin ??
const deleteMinorCategory = asyncHandler(async (req, res) => {
  let id = req.params.id;
  // const subCategory = await SubCategory.findOne({
  //   'minorCategory.id': { id },
  // });
  const subCategory = await SubCategory.findOne({
    minorCategory: { $elemMatch: { _id: id } },
  });
  if (!subCategory) {
    res.status(404);
    res.json({ message: 'Parent SubCategory not found' });
  } else {
    const updatedCategory = subCategory.minorCategory.filter(category => {
      return category.id !== id;
    });
    subCategory.minorCategory = updatedCategory;
    await subCategory.save();
    res.json({ ...subCategory, success : true });
    // res.json({success: true});
  }
});

module.exports = {
  getCategories,
  createCategory,
  createSubCategory,
  createMinorCategory,
  deleteCategory,
  deleteSubCategory,
  deleteMinorCategory,
};
