exports.register = async function (server, options) {
  server.route(require('./read'))
}

exports.name = 'http-resource-download'
