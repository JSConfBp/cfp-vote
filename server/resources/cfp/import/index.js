const bodyParser = require('body-parser')
const adminMiddleware = require('../../../middleware/admin')

module.exports = (server, middlewares = []) => {
  server.post('/api/cfp/import/activate', ...middlewares, adminMiddleware, require('./activate'))
  server.post('/api/cfp/import/code', ...middlewares, adminMiddleware, bodyParser.text(), require('./code'))
}
