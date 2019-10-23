const Boom = require('boom')
const token = require('./token')
const client = require('../services/client')

const USERS = JSON.parse(process.env.CFP_VOTE_USERS || '[]')

const unauthorized = function (err = {}) {
  let scheme = 'Bearer'

  if (err instanceof Error) {
    scheme += ' error="invalid_token"'
  }

  let response = Boom.unauthorized(err.message || 'Token required', [scheme])
  response.name = err.name || 'TOKEN_REQUIRED'

  return response
}

const authenticate = async function (request, h) {
  const authorization = request.headers.authorization

  if (!authorization) {
    return h.unauthenticated(unauthorized())
  }

  try {
    const payload = await token.decode(authorization)

    if (payload.kiosk) {
      return h.unauthenticated(unauthorized())
    }

    const login = payload.login
    const id = payload.sub
    const clientData = await client.readById(id)

    if (!clientData) return h.unauthenticated(unauthorized())

    const isUser = USERS.includes(login)

    if (!isUser) return h.unauthenticated(unauthorized())

    const { secret } = clientData

    await token.validate(authorization, secret)

    return h.authenticated({ credentials: { id, token: authorization } })
  } catch (err) {
    return h.unauthenticated(unauthorized(err))
  }
}

module.exports = function (server, options) {
  return {
    authenticate
  }
}
