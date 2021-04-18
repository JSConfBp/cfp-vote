const adminMiddleware = require('../../middleware/admin')

module.exports = async function (server, middlewares) {
  server.get('/api/users', ...middlewares, adminMiddleware, require('./get'))
  server.get('/api/users_full', ...middlewares, adminMiddleware, require('./get_full'))
  server.post('/api/user', ...middlewares, adminMiddleware, require('./post'))
  server.delete('/api/user', ...middlewares, adminMiddleware, require('./delete'))
}
