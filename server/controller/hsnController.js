const asyncHandler = require('express-async-handler');
const HSN = require('../models/HSNModel.js');

//@desc Get all HNS
//@route GET /api/hns
//@access Public
const getHSN = asyncHandler(async (req, res) => {
  try {
    const allHSN = await HSN.find({});
    res.json(allHSN);
  } catch (error) {
    throw new Error(error);
  }
});

//@desc Search HNS
//@route GET /api/products
//@access Public
const searchHSN = asyncHandler(async (req, res) => {
  try {
    const allHSN = await HSN.find({
      category: { $regex: new RegExp(req.query.query, 'i') },
    });
    res.json(allHSN);
  } catch (error) {
    throw new Error(error);
  }
});

//@desc Add HSN
//@route GET /api/hsn
//@access Admin
const addHSN = asyncHandler(async (req, res) => {
  try {
    const value = req.body.value;
    const sgst = req.body.sgst;
    const cgst = req.body.cgst;
    const igst = req.body.igst;
    const category = req.body.category;
    const subCategory = req.body.subCategory;
    const newHSN = await HSN.create({
      category,
      subCategory,
      value,
      cgst,
      sgst,
      igst
    });
    if (!newHSN) {
      throw new Error('HSN could not be created, try again later');
    } else {
      res.json(newHSN);
    }
  } catch (error) {
    throw new Error(error);
  }
});

//@desc Edit HSN
//@route PUT /api/products
//@access Admin
const editHSN = asyncHandler(async (req, res) => {
  try {
    const value = req.body.value;
    const sgst = req.body.sgst;
    const cgst = req.body.cgst;
    const igst = req.body.igst;
    const category = req.body.category;
    const subCategory = req.body.subCategory;
    const id = req.params.id;
    const foundHSN = await HSN.findById(id);
    if (foundHSN) {
      foundHSN.category = category;
      foundHSN.subCategory = subCategory;
      foundHSN.value = value;
      foundHSN.sgst = sgst;
      foundHSN.cgst = cgst;
      foundHSN.igst = igst;
      const newHSN = await foundHSN.save();
      if (!newHSN) {
        throw new Error('HNS could not be edited, try again later');
      } else {
        res.json(newHSN);
      }
    } else {
      throw new Error('HNS Not found');
    }
  } catch (error) {
    throw new Error(error);
  }
});

//@desc Delete HSN
//@route DELETE /api/hsn
//@access Admin
const deleteHSN = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const foundHSN = await HSN.findById(id);
    if (foundHSN) {
      await HSN.deleteOne({ id: id });
      res.json({ success: true, message: 'HSN deleted' });
    } else {
      throw new Error('HSN Not found');
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { addHSN, editHSN, getHSN, deleteHSN, searchHSN };
