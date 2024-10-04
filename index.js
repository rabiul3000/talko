import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import Twitter from 'twitter-lite';

dotenv.config();

const app = express();

app.use(
	session({
		secret: process.env.TWITTER_API_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);

const twitterClient = new Twitter({
	consumer_key: process.env.TWITTER_API_KEY,
	consumer_secret: process.env.TWITTER_API_SECRET,
});

app.get('/auth/twitter', async (req, res) => {
	try {
		const response = await twitterClient.getRequestToken(
			'http://localhost:3000/auth/twitter/callback'
		);

		// Store token and token secret in session
		req.session.oauth_token = response.oauth_token;
		req.session.oauth_token_secret = response.oauth_token_secret;

		// Redirect user to Twitter to authenticate
		res.redirect(
			`https://api.twitter.com/oauth/authenticate?oauth_token=${response.oauth_token}`
		);
	} catch (error) {
		console.error('Error getting request token', error);
		res.status(500).send('Error getting request token');
	}
});

app.get('auth/twitter/callback', async (req, res) => {
	const { oauth_token, oauth_verifier } = req.query;

	if (oauth_token !== req.session.oauth_token) {
		return res.status(400).send('OAuth token mismatch');
	}

	try {
		// Use the stored oauth_token and secret to get the access token
		const response = await twitterClient.getAccessToken({
			oauth_token: req.session.oauth_token,
			oauth_token_secret: req.session.oauth_token_secret,
			oauth_verifier,
		});

		// Store the access token and secret for future API requests
		req.session.access_token = response.oauth_token;
		req.session.access_token_secret = response.oauth_token_secret;
		req.session.user_id = response.user_id;
		req.session.screen_name = response.screen_name;

		// Redirect to dashboard after login
		res.redirect('/dashboard');
	} catch (error) {
		console.error('Error getting access token', error);
		res.status(500).send('Error getting access token');
	}
});







app.get('/', (req, res) => {
	res.status(200).json('server is running');
});

app.get('*', (req, res) => {
	res.status(404).send('<h1> 404 not found </h1>');
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
	console.log('server is running on http://localhost:' + port);
});
