const express = require('express');
const paymentRouter = express.Router();
const {paymentController} = require('../controllers');
const authMiddleware = require('../middleware/auth');

// PRIVATE ROUTES
paymentRouter.post('/create', authMiddleware, paymentController.create);
paymentRouter.get('/getHistory', authMiddleware, paymentController.getPaymentsHistory);
paymentRouter.delete('/delete/:id', authMiddleware, paymentController.delete);

//PUBLIC ROUTES
paymentRouter.get('/getDetails/:uuid', paymentController.getPaymentDetails);
paymentRouter.patch('/patch', paymentController.update);

module.exports = paymentRouter;
