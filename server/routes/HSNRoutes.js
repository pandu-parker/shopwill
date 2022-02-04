const express = require('express');

const router = express.Router();

const HSNController = require('../controller/hsnController')

router.route('/').get(HSNController.getHSN).post(HSNController.addHSN);
router.route('/search').get(HSNController.searchHSN)
router.route('/:id').put(HSNController.editHSN).delete(HSNController.deleteHSN);

module.exports = router;
