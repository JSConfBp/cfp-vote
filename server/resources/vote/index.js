exports.register = async function (server, options) {
  server.route(require('./post'))
}

exports.name = 'http-resource-vote'
