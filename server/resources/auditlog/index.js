const bodyParser = require('body-parser')
const adminMiddleware = require('../../middleware/admin')

module.exports = (server, middlewares = []) => {
  server.get('/api/auditlog', ...middlewares, adminMiddleware, bodyParser.json(), require('./get'))
}
