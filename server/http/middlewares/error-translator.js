const Boom = require('boom')
const uuid = require('uuid/v4')
const ErrorResponse = require('../responses/ErrorResponse')

const internals = {}

/**
 * Create new Boom object based on the source's name.
 *
 * @param {Object} err - Boom error object
 * @return {Object} Boom error object
 */
internals.convert = function (err) {
  switch (err.name) {
    case 'RecordNotFoundError':
      return Boom.notFound()

    case 'AlreadyInUseError':
      return Boom.conflict()

    default:
      return err
  }
}

exports.register = function (server, options, next) {
  /**
   * Trace code for errors
   * @see https://pages.github.ibm.com/CloudEngineering/api_handbook/design/errors.html#error-container-model
   */
  server.ext('onRequest', (request, reply) => {
    request.id = uuid()
    reply.continue()
  })

  server.ext('onPreResponse', (request, reply) => {
    let response = request.response

    if (!response.isBoom) {
      return reply.continue()
    }

    response = internals.convert(response)

    response.output.payload = new ErrorResponse(request)

    reply(response)
  })

  next()
}

exports.register.attributes = {
  name: 'http-middleware-error-translator'
}
