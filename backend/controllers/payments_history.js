const paymentHistoryDb = require('../models').paymentHistoryModel;
const userDb = require('../models').userModel;
const paymentDb = require('../models').paymentModel; 

const controller = {

    create: async (req, res) => {
        try {
            const newHistoryEntry = {
                idPay: req.body.idPay,
                idPayer: req.body.idPayer,
                status: req.body.status,
            };
            await paymentHistoryDb.create(newHistoryEntry);
            res.status(200).json('Payment history record created');
        } catch (err) {
            console.log(err);
            res.status(500).json('Server error!');
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const history = await paymentHistoryDb.findOne({
                where: { id: id },
                include: [
                    {
                        model: userDb,
                        as: 'Payer',
                        attributes: ['username', 'email']
                    },
                    {
                        model: paymentDb,
                        attributes: ['amount', 'description']
                    }
                ]
            });
            res.status(200).json(history);
        } catch (err) {
            console.log(err);
            res.status(500).json('Server error!');
        }
    },

    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            await paymentHistoryDb.update(
                { status: status },
                { where: { id: id } }
            );
            res.status(200).json('Payment status updated successfully');
        } catch (err) {
            console.log(err);
            res.status(500).json('Server error!');
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            await paymentHistoryDb.destroy({
                where: { id: id }
            });
            res.status(200).json('History record deleted');
        } catch (err) {
            console.log(err);
            res.status(500).json('Server error!');
        }
    }
};

module.exports = controller;