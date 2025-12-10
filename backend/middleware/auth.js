require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Missing authorization header' });
    }

    const parts = req.headers.authorization.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Invalid authorization format. Expected: Bearer <token>' });
    }
    
    const token = parts[1];

    try {

        const tokenContents = jwt.verify(token, JWT_SECRET);
        
        req.user = tokenContents; 

        next();
    } catch (err) {

        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;