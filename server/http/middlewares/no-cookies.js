/**
 * Drop the Cookie header from the request.
 *
 * @param server
 * @param options
 */
exports.register = async function (server, options) {
  server.ext('onRequest', (request, h) => {
    delete request.raw.req.headers['cookie']

    return h.continue
  })
}

exports.name = 'http-middleware-no-cookies'
