module.exports = (server, middlewares = []) => {

    server.get('/login', ...middlewares, (req, res) => res.redirect('/'))

}