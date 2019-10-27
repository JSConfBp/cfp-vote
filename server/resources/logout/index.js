module.exports = (server, middlewares = []) => {
    server.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })
}