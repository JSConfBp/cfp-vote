exports.register = function (server, options) {
  server.route(require('./refresh'))
  server.route(require('./create'))
}

exports.name = 'http-resource-token'
