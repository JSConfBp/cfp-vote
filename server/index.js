const next = require('next')
const express = require('express')
const passport = require('passport')
const router = require('./router')
const errorHandler = require('./errorHandler')
const oauthHandler = require('./oauthHandler')

const dev = process.env.NODE_ENV !== 'production'

module.exports = function (getRoutes, config) {
	const app = next({ dev, conf: config })
	const handle = app.getRequestHandler()
	const nextConfig = app.nextConfig

	const initNext = (app) => {
		return app
			.prepare()
			.then(() => {
				const server = express()
				server.use(cookieParser())
				server.nextConfig = app.nextConfig

				return server
			})
  }

  const attachAPIRoutes = (server) => {
    server.use(require('helmet')())
    server.use(require('cookie-parser')())
    server.use(require('body-parser').urlencoded({ extended: true }))
    server.use(require('express-session')({
      secret: 'keyboard cat',
      resave: true,
      saveUninitialized: true
    }))

    const GitHubStrategy = require('passport-github').Strategy
    passport.use(new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/github/callback"
      },
      function(accessToken, refreshToken, profile, cb) {



        // User.findOrCreate({ githubId: profile.id }, function (err, user) {
        //   return cb(err, user);
        // });

      }
    ));
    server.use(passport.initialize())
    server.use(passport.session())
  }

	const attachNextRoutes = (server) => {
    const routes = router(app, getRoutes)

		server.use('/', routes)
		server.get('*', (req, res) => handle(req, res))

		return server
	}

	const startServer = (server) => {
		const { port } = config

		server.listen(port, (err) => {
			if (err) throw err
			console.log(`> Ready on http://0.0.0.0:${port}`)
		})
	}

	return Promise.resolve(app)
    .then(initNext)
    .then(attachAPIRoutes)
		.then(attachNextRoutes)
		.then(startServer)
		.catch(errorHandler)
}
