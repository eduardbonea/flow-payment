const db = require('../config/db');
const userModel = require('./user');
const paymentHistoryModel = require('./payments_history');
const paymentModel = require('./payments');

userModel.belongsToMany(paymentModel, 
    {through: paymentHistoryModel})
paymentModel.belongsToMany(userModel, 
    {through: paymentHistoryModel})

module.exports = {db, userModel, paymentHistoryModel, paymentModel};