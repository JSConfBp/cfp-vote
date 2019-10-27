module.exports = (server, middlewares = []) => {

  server.post('/api/cfp', ...middlewares, require('./create'))
  server.get('/api/cfp', ...middlewares, require('./read'))
  server.put('/api/cfp', ...middlewares, require('./update'))

  // server.route(require('./create'))
  // server.route(require('./read'))
  // server.route(require('./update'))
  // server.route(require('./remove'))

  // server.route(require('./import/activate'))
  // server.route(require('./import/code'))
  // server.route(require('./import/sheet'))
  // server.route(require('./import/fields'))
}