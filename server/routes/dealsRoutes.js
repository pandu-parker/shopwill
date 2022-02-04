const express = require('express');

const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleWare');
const dealsController = require('../controller/dealsController');

router
  .route('/')
  .post(authMiddleWare.isAdmin, dealsController.addDeal)
  .get(dealsController.getDeals);

  router
  .route('/:id')
  .put(authMiddleWare.isAdmin, dealsController.editDeal)
  .delete(authMiddleWare.isAdmin, dealsController.deleteDeal);

  
router
.route('/all')
.get(authMiddleWare.isAdmin, dealsController.getAllDeals)

module.exports = router;
