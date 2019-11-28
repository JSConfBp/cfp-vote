const adminMiddleware = require('../../middleware/admin')

module.exports = async function (server, middlewares) {
  server.get('/api/settings', ...middlewares, adminMiddleware, require('./get'))
  server.put('/api/settings', ...middlewares, adminMiddleware, require('./put'))
}
