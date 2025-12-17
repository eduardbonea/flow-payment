const paymentDb = require('../models').paymentModel;
const userDb = require('../models').userModel;

const controller = {

    create: async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json('Unauthorized');
        }

        const idRequester = req.user.id;
        const payeerUsername = req.body.username;

        const payeer = await userDb.findOne({
            where: { username: payeerUsername },
            attributes: ['id']
        });

        if (!payeer) {
            return res.status(404).json('Payeer not found');
        }

        const newPayment = {
            idRequester,
            idPayeer: payeer.id,
            amount: Number(req.body.amount),
            currency: req.body.currency,
            description: req.body.description,
            expireDate: new Date(req.body.expireDate),
            createdAt: new Date(),
        };

        const createdPayment = await paymentDb.create(newPayment);

        res.status(201).json({
            message: 'Payment created',
            paymentId: createdPayment.id
        });

    } catch (err) {
        console.error('PAYMENT CREATE ERROR:', err);
        res.status(500).json({
            message: 'Server Error',
            error: err.message
        });
    }
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