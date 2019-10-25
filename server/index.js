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
  const { port } = config

	const initExpress = () => {
    const server = express()

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
        callbackURL: `http://0.0.0.0:${port}/auth/github/callback` // get heroku hostname?
      },
      function(accessToken, refreshToken, profile, cb) {

        console.log({
          profile
        });
        

        // User.findOrCreate({ githubId: profile.id }, function (err, user) {
        //   return cb(err, user);
        // });

      }
    ));
    server.use(passport.initialize())
    server.use(passport.session())

    server.nextConfig = app.nextConfig

    return server
  }

  const attachAPIRoutes = (server) => {

    const authMiddleware = () => passport.authenticate('github', { failureRedirect: '/login' })
    const loginMiddleware = () => passport.authenticate('github', { successRedirect: '/', failureRedirect: '/login' })

    require('./resources/client')(server, [ authMiddleware ])
    require('./resources/login')(server, [ loginMiddleware ])

    return server
  }

	const attachNextRoutes = (server) => {
    const routes = router(app, getRoutes)

		server.use('/', routes)
		server.get('*', (req, res) => handle(req, res))

		return server
	}

	const startServer = (server) => {
		server.listen(port, (err) => {
			if (err) throw err
			console.log(`> Ready on //0.0.0.0:${port}`)
		})
	}

  return app
    .prepare()
    .then(initExpress)
    .then(attachAPIRoutes)
		.then(attachNextRoutes)
		.then(startServer)
		.catch(errorHandler)
}
