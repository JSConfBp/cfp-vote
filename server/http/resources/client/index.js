exports.register = async function (server) {
  server.route(require('./create'))
  server.route(require('./read'))
  server.route(require('./update'))
}

exports.name = 'http-resource-client'
