const express = require('express');
const paymentRouter = express.Router();
const {paymentController} = require('../controllers');
const {authMiddleware, emailLimiter} = require('../middleware');

// PRIVATE ROUTES
paymentRouter.post('/create', authMiddleware, paymentController.create);
paymentRouter.get('/getHistory', authMiddleware, paymentController.getPaymentsHistory);
paymentRouter.delete('/delete/:id', authMiddleware, paymentController.delete);

//PUBLIC ROUTES
paymentRouter.get('/getDetails/:uuid', paymentController.getPaymentDetails);
paymentRouter.patch('/patch', paymentController.update);
paymentRouter.post('/notify', emailLimiter, paymentController.notifyPaymentSent);

module.exports = paymentRouter;
