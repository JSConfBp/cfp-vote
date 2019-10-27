const next = require('next')
const express = require('express')
const passport = require('passport')
const router = require('./router')
const errorHandler = require('./errorHandler')
const logger = require('./logger')
const dev = process.env.NODE_ENV !== 'production'

const authStrategy = require('./auth/githubStrategy')

passport.use(authStrategy)
passport.serializeUser(authStrategy.serializeUser);
passport.deserializeUser(authStrategy.deserializeUser);

module.exports = function (getRoutes, config) {
  const app = next({ dev, conf: config })
	const handle = app.getRequestHandler()
  const { port } = config

  const authMiddleware = passport.authenticate('github', { failureRedirect: '/' })
  const loginMiddleware = passport.authenticate('github', { successRedirect: '/user', failureRedirect: '/' })

  const initExpress = () => {
    const server = express()

    server.use(require('express-pino-logger')({
      logger
    }))
    // server.use(require('morgan')('combined'));
    server.use(require('helmet')())
    server.use(require('cookie-parser')())
    server.use(require('body-parser').urlencoded({ extended: true }))
    server.use(require('express-session')({
      secret: require('uuid/v4')(),
      resave: false,
      saveUninitialized: false
    }))
    server.use(passport.initialize())
    server.use(passport.session())

    return server
  }

  const attachAPIRoutes = (server) => {
    require('./resources/login')(server, [ loginMiddleware ])
    require('./resources/logout')(server)
    require('./resources/oauth')(server, [ authMiddleware ])
    require('./resources/client')(server, [ authMiddleware ])

    return server
  }

	const attachNextRoutes = (server) => {
    const routes = router(app, getRoutes, authMiddleware)

		server.use('/', routes)
    server.get('*', (req, res) => handle(req, res))
    
		return server
	}

  const attachErrorHandlers = (server) => {
    server.use((err, req, res, next) => {
      req.log.error(err.stack)
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
			logger.info(`App ready on //0.0.0.0:${port}`)
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
