const auditlog = require('../../auth/auditlog')

module.exports = (server, middlewares = []) => {
    server.get('/logout', (req, res) => {
        auditlog(req.user.login, 'logout')
        req.logout();
        res.redirect('/');
    })
}