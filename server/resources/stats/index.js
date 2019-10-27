module.exports = async function (server, middlewares) { 
  server.get('/api/stats', ...middlewares, require('./read'))
  server.get('/api/histogram', ...middlewares, require('./histogram'))
}