const bodyParser = require('body-parser')
const adminMiddleware = require('../../../middleware/admin')

module.exports = (server, middlewares = []) => {
  server.post('/api/cfp/import/activate', ...middlewares, adminMiddleware, require('./activate'))
  server.post('/api/cfp/import/code', ...middlewares, adminMiddleware, bodyParser.text(), require('./code'))
  server.post('/api/cfp/import/sheet', ...middlewares, adminMiddleware, require('./sheet'))
  server.post('/api/cfp/import/fields', ...middlewares, adminMiddleware, require('./fields'))
  server.post('/api/cfp/import/sessionize/activate', ...middlewares, adminMiddleware, require('./sessionize/activate'))
  server.post('/api/cfp/import/sessionize/fields', ...middlewares, adminMiddleware, require('./sessionize/fields'))
}
