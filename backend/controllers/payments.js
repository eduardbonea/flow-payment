const paymentDb = require('../models').paymentModel;
const userDb = require('../models').userModel;

const controller = {

    create: async (req, res) => {
        try{
            const newPayment = {
                idRequester: req.user.id,
                idPayeer: payeerUsername,
                amount: req.body.amount,
                currency: req.body.currency,
                description: req.body.description,
                expireDate: req.body.expireDate,
                createdAt: newDate(),
            };
            const createdPayment = await paymentDb.create(newPayment);
            res.status(200).json('Payment created!');
        }catch(err){
            console.log(err);
            res.status(500).json('Server Error!');
        };
    },

    getById: async (req, res) => {
        try{
            const paymentData = {
                id: req.params.id,
            };
            const fetchPayment = await require('../models/payments');
            res.status(200).json('Payment found!')
        }catch(err){
            console.log(err);
            res.status(500).json('Server Error!');
        };
    },

    update: async (req, res) => {
        try{
            const paymentId = req.params.id;
            const newStatus = req.body.status;
            const updateStatus = {
                id: paymentId,
                status: newStatus,
            };
            const patchStatus = await paymentDb.update(
                { status: newStatus },
                {
                    where: {
                        id: paymentId
                    }
                }
            );
            res.status(200).json('Payment status updated successfully');
        }catch(err){
            console.log(err);
            res.status(500).json('Server Error!');
        };
    },

    delete: async (req, res) => {
        try{
            const paymentId = req.params.id;
            const removePayment = await paymentDb.destroy(
                {
                    where: {
                        id: paymentId
                    }
                }
            );
        }catch(err){
            console.log(err);
            res.status(500).json('Server Error!')
        };
    },
}

module.exports = controller;