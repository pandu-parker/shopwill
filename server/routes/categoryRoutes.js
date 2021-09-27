const express = require('express');

const router = express.Router();

const categoryRoutes = require('../controller/categoryController')

router.route('/category').get(categoryRoutes.getCategories).post(categoryRoutes.createCategory)
router.route('/category/:id').delete(categoryRoutes.deleteCategory).put(categoryRoutes.createCategory)

router.route('/subcategory').post(categoryRoutes.createSubCategory)
router.route('/subcategory/:id').delete(categoryRoutes.deleteSubCategory)
router.route('/minorcategory').post(categoryRoutes.createMinorCategory)
router.route('/minorcategory/:id').delete(categoryRoutes.deleteMinorCategory)

module.exports = router;
