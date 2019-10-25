const next = require('next')
const express = require('express')
const passport = require('passport')
const router = require('./router')
const errorHandler = require('./errorHandler')

const dev = process.env.NODE_ENV !== 'production'

passport.use(require('./auth/githubStrategy'))
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = function (getRoutes, config) {
  const app = next({ dev, conf: config })
	const handle = app.getRequestHandler()
  const { port } = config

  const initExpress = () => {
    const server = express()

    server.use(require('morgan')('combined'));
    server.use(require('helmet')())
    server.use(require('cookie-parser')())
    server.use(require('body-parser').urlencoded({ extended: true }))
    server.use(require('express-session')({
      secret: require('uuid/v4')(),
      resave: true,
      saveUninitialized: true
    }))

    server.use(passport.initialize())
    server.use(passport.session())

    return server
  }

  const attachAPIRoutes = (server) => {
    const authMiddleware = passport.authenticate('github', { failureRedirect: '/' })
    const loginMiddleware = passport.authenticate('github', { successRedirect: '/user', failureRedirect: '/' })

    require('./resources/login')(server, [ loginMiddleware ])
    require('./resources/oauth')(server, [ authMiddleware ])
    require('./resources/client')(server, [ authMiddleware ])

    return server
  }

	const attachNextRoutes = (server) => {
    const routes = router(app, getRoutes)

		server.use('/', routes)
    server.get('*', (req, res) => handle(req, res))
    
		return server
	}

  const attachErrorHandlers = (server) => {
    server.use((err, req, res, next) => {
      console.error(err.stack)
      next(err)
    })

    server.use((err, req, res, next) => {
      if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' })
      } else {
        next(err)
      }
    })

    server.use((err, req, res, next) => {
      res.status(500)
      res.render('error', { error: err })
    })
    
    return server
  }

	const startServer = (server) => {
		server.listen(port, (err) => {
			if (err) throw err
			console.log(`App ready on //0.0.0.0:${port}`)
		})
	}

  return app
    .prepare()
    .then(initExpress)
    .then(attachAPIRoutes)
    .then(attachNextRoutes)
    .then(attachErrorHandlers)
    .then(startServer)
		.catch(errorHandler)
}
