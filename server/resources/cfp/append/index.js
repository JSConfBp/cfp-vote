const bodyParser = require('body-parser')
const adminMiddleware = require('../../../middleware/admin')

module.exports = (server, middlewares = []) => {
  server.get('/api/cfp/append', ...middlewares, adminMiddleware, require('./prepare'))
  server.put('/api/cfp/append', ...middlewares, adminMiddleware, require('./append'))
}
