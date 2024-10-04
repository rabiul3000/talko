import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import Twitter from 'twitter-lite';

dotenv.config();

const app = express();






app.get('/', (req, res) => {
	res.status(200).json('server is running');
});


const port = process.env.PORT || 9000;
app.listen(port, () => {
	console.log('server is running on http://localhost:' + port);
});
