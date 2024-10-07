const express = require('express');
const UserController = require('../controller/user.controller');
const UserMiddleWare = require('../services/jwtToken');

const router = express.Router();
const userController = new UserController();
const userMiddleware = new UserMiddleWare();

router.post('/signIn', userController.signIn);
router.post('/verifyToken', userController.checkToken);
router.post('/searchUser', userMiddleware.tokenVerifier, userController.searchUser);
router.post('/createUser', userController.createUser);
router.put('/updateUser', userMiddleware.tokenVerifier, userController.updateUser);
router.get('/listAllUsers', userMiddleware.tokenVerifier, userController.listAllUsers);
router.delete('/deleteUser', userMiddleware.tokenVerifier, userController.deleteUser);

module.exports = router 