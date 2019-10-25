exports.register = async function (server, options) {
  server.route(require('./create'))
  server.route(require('./read'))
  server.route(require('./update'))
  server.route(require('./remove'))

  server.route(require('./import/activate'))
  server.route(require('./import/code'))
  server.route(require('./import/sheet'))
  server.route(require('./import/fields'))
}

exports.name = 'http-resource-cfp'
