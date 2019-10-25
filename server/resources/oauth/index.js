module.exports = (server, middlewares) => {

    server.get('/oauth', ...middlewares, (req, res) => {

      console.log(req);
      

      res.redirect('/user');
    })

}