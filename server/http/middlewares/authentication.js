exports.register = async function (server, options) {
  server.auth.scheme('jwt', require('../../auth/jwt-scheme'))
  server.auth.strategy('jwt', 'jwt')

  server.auth.scheme('admin', require('../../auth/admin-scheme'))
  server.auth.strategy('admin', 'admin')

  server.auth.default('jwt')
}

exports.name = 'http-middleware-auth'
