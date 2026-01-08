const { rateLimit } = require('express-rate-limit');

const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minute
	limit: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
    message: { 
        message: "You are being rate limited" 
    }
});

const emailLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 ora
	limit: 5,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	message: { 
        message: "You are being rate limited" 
    },
});

module.exports = { globalLimiter, emailLimiter };