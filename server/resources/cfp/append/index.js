const adminMiddleware = require('../../../middleware/admin')

module.exports = (server, middlewares = []) => {
  server.get('/api/cfp/append/gsheet', ...middlewares, adminMiddleware, require('./gsheet/prepare'))
  server.put('/api/cfp/append/gsheet', ...middlewares, adminMiddleware, require('./gsheet/append'))
  server.get('/api/cfp/append/sessionize', ...middlewares, adminMiddleware, require('./sessionize/prepare'))
  server.put('/api/cfp/append/sessionize', ...middlewares, adminMiddleware, require('./sessionize/append'))
}
