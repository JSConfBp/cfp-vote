module.exports = async function (server, middlewares) {
  server.get('/api/export', ...middlewares, require('./get'))
}
