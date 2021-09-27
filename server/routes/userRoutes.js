const express = require('express');

const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleWare')

const userRoutes = require('../controller/userController')
const authUser = userRoutes.authUser
const registerUser = userRoutes.registerUser
const getAllUsers = userRoutes.getAllUsers

router.route('/').post(registerUser).get(getAllUsers);
router.route('/login').post(authUser);
router.route('/shipping').post(authMiddleWare.isAuth, userRoutes.addShippingAddress)
router.route('/shipping/:id').delete(authMiddleWare.isAuth, userRoutes.deleteShippingAddress)

module.exports = router;
