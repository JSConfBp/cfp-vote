const routes = {
	'home': { path: '/', page: 'home', needAuth: false },
	'user': { path: '/user', page: 'user', needAuth: true },
	'vote': { path: '/vote', page: 'vote', needAuth: true },
	'stats': { path: '/stats', page: 'stats', needAuth: true },
	'admin': { path: '/admin', page: 'admin', needAuth: true },
}

module.exports = () => routes