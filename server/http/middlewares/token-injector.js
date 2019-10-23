const token = require('../../auth/token')

exports.register = function (server, options, next) {
  server.ext('onPreAuth', function (request, reply) {
    const authorization = request.headers.authorization

    // If JWT token is present leave it untouched
    if (authorization) {
      return reply.continue()
    }

    token.create({
      sub: 1
    })
      .then((token) => {
        request.headers.authorization = token
        reply.continue()
      })
  })

  next()
}

exports.register.attributes = {
  name: 'http-middleware-token-injector'
}
