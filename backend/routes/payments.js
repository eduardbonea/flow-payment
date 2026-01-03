const express = require('express');
const paymentRouter = express.Router();
const {paymentController} = require('../controllers');
const authMiddleware = require('../middleware/auth');

paymentRouter.post('/create', authMiddleware, paymentController.create);
paymentRouter.get('/getid/:id', authMiddleware, paymentController.getById);
paymentRouter.get('/getHistory', authMiddleware, paymentController.getPaymentsHistory);
paymentRouter.patch('/patch/:id', authMiddleware, paymentController.update);
paymentRouter.delete('/delete/:id', authMiddleware, paymentController.delete);

module.exports = paymentRouter;
