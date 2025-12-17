const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../models').db; 

const userDb = require('../models').userModel;
const user = userDb

const JWTSecret = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
    const username = req.body.username;
	const password = req.body.password;

	try{
		const foundUser = await user.findOne({
			where: { 
				username: username,
				password: password
			}
		});
		if(foundUser) {

			console.log('Found', foundUser);
		
			const token = jwt.sign(
			{ 
				id: foundUser.id,
				username: foundUser.username 
			}, 
			JWTSecret, 
			{ expiresIn: '1h' }
		);
		
		res.status(200).json({token});
}
	}catch(err) {
		console.log(err);
		res.status(500).json('Server error!')
	};
});

module.exports = router;