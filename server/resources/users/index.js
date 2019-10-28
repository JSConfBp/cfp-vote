module.exports = async function (server, middlewares) { 
  server.get('/api/users', ...middlewares, require('./get'))
  server.post('/api/user', ...middlewares, require('./post'))
  server.delete('/api/user', ...middlewares, require('./delete'))
}