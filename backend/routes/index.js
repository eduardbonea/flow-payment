const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const paymentRouter = require('./payments');
const authRouter = require('./auth');

router.use('/user', userRouter);
router.use('/payment', paymentRouter);
router.use('/auth', authRouter);

module.exports = router;