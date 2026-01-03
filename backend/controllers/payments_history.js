const userDb = require('../models').paymentHistoryModelModel;

getPaymentDetails: async (req, res) => {
    try {
        const {id} = req.params;

        const participants = await paymentHistoryModel.findAll({
            where: {idPay: id},
            include: [{
                model: userModel,
                attributes: ['username']
            }]
        });

        res.status(200).json(participants);
    } catch (err) {
        res.status(500).json('Error fetching participants');
    }
}