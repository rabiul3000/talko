import express from 'express';

const app = express();

const port = 8000;







app.get('/', (req, res) => {
    res.status(200).json('server is running')
}) 


app.listen(port, () => {
	console.log( 'server is running on http://localhost:' +port);
});
