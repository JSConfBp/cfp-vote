module.exports = (server, middlewares) => {

  server.post('/client', require('./create'))
  server.get('/client/:id', ...middlewares, require('./read'))
  
  // server.put('/client/:id', ...middlewares, require('./update'))
  // server.delete('/client/:id', ...middlewares, require('./delete'))
}