const userDb = require('../models').userModel;

const controller = {

    create: async (req, res) => {
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

    getById: async (req, res) => {
        try{
            const idData = {
                id: req.params.id,
            };
            const fetchUser = await require('../models/user');
            res.status(200).json('User found');
        }catch(err){
            console.log(err);
            res.status(500).json('Server error!');
        };
    },

    updateUsername: async (req, res) => {
        try{
            const userId = req.params.id;
            const newUsername = req.body.username;
            const updateUsername = {
                id: userId,
                username: newUsername,
            };
            const patchUsername = await userDb.update(
                {username: newUsername },
                {
                    where: {
                        id: userId
                    }
                }
            );
            res.status(200).json('Username updated successfully');
        }catch(err){
            console.log(err);
            res.status(500).json('Server error!');
        };
    },

    updatePassword: async (req, res) => {
        try{
            const userId = req.params.id;
            const newPassword = req.body.password;
            const updatePassword = {
                id: userId,
                password: newPassword,
            };
            const patchPassword = await userDb.update(
                {password: newPassword },
                {
                    where: {
                        id: userId
                    }
                }
            );
            res.status(200).json('Password updated successfully');
        }catch(err){
            console.log(err);
            res.status(500).json('Server error!');
        };
    },

    updateEmail: async (req, res) => {
        try{
            const userId = req.params.id;
            const newEmail = req.body.email;
            const updateEmail = {
                id: userId,
                email: newEmail,
            };
            const patchEmail = await userDb.update(
                {email: newEmail },
                {
                    where: {
                        id: userId
                    }
                }
            );
            res.status(200).json('Email updated successfully');
        }catch(err){
            console.log(err);
            res.status(500).json('Server error!');
        };
    },

    delete: async (req, res) => {
        try{
            const userId = req.params.id;
            const removeUser = await userDb.destroy(
                {
                    where: {
                        id: userId 
                    }
                }
            );
            res.status(200).json('User deleted successfully');
        }catch(err){
            console.log(err);
            res.status(500).json('Server error!');
        };
    },
};

module.exports = controller;