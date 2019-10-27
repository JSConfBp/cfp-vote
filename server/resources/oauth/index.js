module.exports = (server, middlewares) => {

    server.get('/oauth', ...middlewares, (req, res) => {
      res.redirect('/user');
    })

}