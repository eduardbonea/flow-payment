const db = require('../config/db');
const userModel = require('./user');
const paymentModel = require('./payment');
const paymentHistoryModel = require('./payments_history');
const payerModel = require('./payer'); 

userModel.hasMany(paymentModel, 
    { foreignKey: 'idRequester', 
        as: 'CreatedRequests' });
paymentModel.belongsTo(userModel, 
    { foreignKey: 'idRequester', 
        as: 'Requester' });

paymentModel.belongsToMany(payerModel, { 
    through: paymentHistoryModel, 
    foreignKey: 'idPay', 
    otherKey: 'idPayer' 
});
payerModel.belongsToMany(paymentModel, { 
    through: paymentHistoryModel, 
    foreignKey: 'idPayer', 
    otherKey: 'idPay' 
});

paymentHistoryModel.belongsTo(paymentModel, { foreignKey: 'idPay', as: 'Payment' });
paymentHistoryModel.belongsTo(payerModel, { foreignKey: 'idPayer', as: 'GuestPayer' });


module.exports = { db, userModel, paymentModel, paymentHistoryModel, payerModel };