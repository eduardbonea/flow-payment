const express = require('express');
const userRouter = express.Router();
const {userController} = require('../controllers');

userRouter.post('/createUser', userController.createUser);

module.exports = userRouter;