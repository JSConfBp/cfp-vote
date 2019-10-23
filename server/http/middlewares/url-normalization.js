exports.register = function (server, options, next) {
  /**
   * Paths SHOULD NOT end with a trailing /
   * @see: https://pages.github.ibm.com/CloudEngineering/api_handbook/design/uris.html#overview
   */
  server.ext('onRequest', function (request, reply) {
    if (request.path.match(/\/$/)) {
      return reply.redirect(request.path.slice(0, -1)).code(301)
    }

    reply.continue()
  })

  next()
}

exports.register.attributes = {
  name: 'http-middleware-url-normalization'
}
