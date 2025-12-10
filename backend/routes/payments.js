const express = require('express');
const paymentRouter = express.Router();
const {paymentController} = require('../controllers');

paymentRouter.post('/create', paymentController.create);
paymentRouter.get('/getid:id', paymentController.getById);
paymentRouter.patch('/patch/:id', paymentController.update);
paymentRouter.delete('/delete/:id', paymentController.delete);

module.exports = paymentRouter;
