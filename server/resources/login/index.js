module.exports = (server, middlewares) => {

    server.post('/login', ...middlewares)

}