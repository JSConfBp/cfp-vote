const fetch = require('isomorphic-unfetch')

module.exports = async (req, res) => {
	if (req.query.state !== process.env.PIOSK_NONCE) {
		res.sendStatus(401);
	}

	const data = {
		client_id: process.env.GH_OAUTH_CLIENT_ID,
		client_secret: process.env.GH_OAUTH_CLIENT_SECRET,
		code: req.query.code,
		redirect_uri: process.env.GH_REDIRECT_URI,
		state: process.env.PIOSK_NONCE,
	}

	const token = await fetch('https://github.com/login/oauth/access_token', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	.then(response => response.json())
	.catch(e => {
		console.error(e)
		res.sendStatus(500);
	})

	const {
		access_token,
  		token_type,
		scope
	} = token

	const userData = await fetch('https://api.github.com/user', {
		method: 'GET',
		headers: {
			'Accept': 'application/vnd.github.v3+json',
			'Content-Type': 'application/json',
			'Authorization': 'token ' + access_token
		}
	})
	.then(response => response.json())
	.catch(e => {
		console.error(e)
		res.sendStatus(500);
	})

	if (!userData) {
		return res.sendStatus(403);
	}


	console.log({
		github_id: (userData.id).toString(),
		name: userData.name,
		login: userData.login,
		token: access_token
	});


	const APIresponse = await fetch(`${process.env.API_URL}/v1/client`,
		{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				github_id: (userData.id).toString(),
				name: userData.name,
				login: userData.login,
				token: access_token
			})
		})
		.then(response => response.json())
		.catch(e => {
			console.error(e)
			res.sendStatus(500);
		})


	res
		.cookie('access_token', access_token, { expires: new Date(Date.now() + 96000000) })
		.redirect(`/user`)
}