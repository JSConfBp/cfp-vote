module.exports = async function (server, middlewares) {
  server.post('/api/vote', ...middlewares, require('./post'))
}
