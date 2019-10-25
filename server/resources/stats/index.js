exports.register = async function (server, options) {
  server.route(require('./read'))
  server.route(require('./histogram'))
}

exports.name = 'http-resource-stats'
