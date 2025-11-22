const userDb = require('../models').userModel;

const controller = {
    createUser: async (req, res) => {
        try{
            const newUser = {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
            };
            const createdUser = await userDb.create(newUser);
            res.status(200).json('User created');
        }catch(err){
            console.log(err);
            res.status(500).json('Server error!');
        };
    },
};

module.exports = controller;