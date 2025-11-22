const express = require('express');
const app = express();
const db = require('./models').db;
const router = require('./routes');
const port = 3111;

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Backend works!');
});

app.use('/api', router);

app.get('/reset', async (req,res) => {
	await db.sync({ force: true });
	res.status(200).send('database has been reset');
});

app.listen(port, () => {
	console.log(`Backend running at http://localhost:${port}`);
});
