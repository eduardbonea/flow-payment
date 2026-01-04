const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const user = require('../models').userModel;

const JWTSecret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json('No token provided');

    jwt.verify(token, JWTSecret, (err, decoded) => {
        if (err) return res.status(403).json('Invalid token');
        req.user = decoded;
        next();
    });
};

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const foundUser = await user.findOne({
            where: { 
                username: username,
                password: password
            }
        });

        if (foundUser) {
            const token = jwt.sign(
                { 
                    id: foundUser.id,
                    username: foundUser.username 
                }, 
                JWTSecret, 
                { expiresIn: '1h' }
            );
            
            res.status(200).json({
                token,
                username: foundUser.username
            });
        } else {
            res.status(401).json('Invalid credentials');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error!');
    }
});

module.exports = {
    authRouter: router,
    authenticateToken: authenticateToken
};