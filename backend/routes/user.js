const express = require('express');
const userRouter = express.Router();
const { userController } = require('../controllers');
const { authenticateToken } = require('./auth');

userRouter.post('/create', userController.create);
userRouter.get('/getProfile', authenticateToken, userController.getProfile);
userRouter.patch('/patchusername/:id', userController.updateUsername);
userRouter.patch('/patchpassword/:id', userController.updatePassword);
userRouter.patch('/patchemail/:id', userController.updateEmail);
userRouter.delete('/delete/:id', userController.delete);

module.exports = userRouter;