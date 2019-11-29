const adminMiddleware = require('../../middleware/admin')
module.exports = async function (server, middlewares) {
  server.get('/api/export', ...middlewares, adminMiddleware, require('./get'))
}
