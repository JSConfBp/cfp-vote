module.exports = async function (server, middlewares) { 
  server.get('/api/settings', ...middlewares, require('./get'))
  server.put('/api/settings', ...middlewares, require('./put'))
}