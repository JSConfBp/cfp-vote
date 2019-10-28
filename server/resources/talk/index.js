module.exports = async function (server, middlewares) {
  server.get('/api/talk', ...middlewares, require('./get'))
}
