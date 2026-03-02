require('dotenv').config();
const express = require('express');
const cors = require ('cors');

const app = express();
app.set('trust proxy', 1);

const db = require('./models').db;
const router = require('./routes');

const { authMiddleware, globalLimiter } = require('./middleware');

const port = process.env.PORT || 3000;
const origin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: `${origin}` }));
app.use(express.json());
app.use(globalLimiter);

app.get('/api/dashboard', authMiddleware, (req, res) => {
    res.status(200).json({ 
        message: `Hello, ${req.user.username}! This is protected data.`,
        yourDecodedToken: req.user
    });
});

app.get('/', (req, res) => {
	res.send('Backend works!');
});

app.use('/api', router);

app.get('/reset', async (req,res) => {
	await db.sync({ force: true });
	res.status(200).send('The database has been successfully reset ');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok'});
});

app.listen(port, () => {
	console.log(`Backend running at http://localhost:${port}`);
});
