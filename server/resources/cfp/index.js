const bodyParser = require('body-parser')

module.exports = (server, middlewares = []) => {

  server.post('/api/cfp', ...middlewares, bodyParser.text({ 
    type: 'text/csv',
    limit: '10mb'
  }), require('./post'))
  server.get('/api/cfp', ...middlewares, bodyParser.json(), require('./get'))
  server.put('/api/cfp', ...middlewares, bodyParser.json(), require('./put'))
  server.delete('/api/cfp', ...middlewares, bodyParser.json(), require('./delete'))

  // server.route(require('./import/activate'))
  // server.route(require('./import/code'))
  // server.route(require('./import/sheet'))
  // server.route(require('./import/fields'))
}