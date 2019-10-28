const next = require('next')
const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
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

  const authMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }

    res.sendStatus(401)
  }
  const loginMiddleware = passport.authenticate('github', { successRedirect: '/user', failureRedirect: '/' })

  const initExpress = () => {
    const server = express()

    if (!dev) {
      server.use(require('express-pino-logger')({
        logger
      }))
    } else {
      server.use((req, res, next) => {
        req.log = res.log = logger.child({req:req})
        next()
      })
    }

    // server.use(require('morgan')('combined'));
    server.use(require('helmet')())
    server.use(require('cookie-parser')())
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
    require('./resources/oauth')(server, [ loginMiddleware ])
    require('./resources/logout')(server)
    require('./resources/client')(server, [ authMiddleware ])
    require('./resources/cfp')(server, [ authMiddleware ])
    require('./resources/stats')(server, [ authMiddleware, bodyParser.json() ])
    require('./resources/users')(server, [ authMiddleware, bodyParser.json() ])
    require('./resources/vote')(server, [ authMiddleware, bodyParser.json() ])
    require('./resources/talk')(server, [ authMiddleware, bodyParser.json() ])

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
