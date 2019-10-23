const token = require('../../../auth/token')
const responses = require('../../responses')
const moment = require('moment')

module.exports = {
  method: 'PATCH',
  path: '/token',
  handler: (request, reply) => {
    const payload = request.auth.credentials.token

    payload.exp = moment().add(1, 'hour').unix()

    return token.create(payload)
      .then((token) => reply(new responses.TokenCreated(token)))
  }
}
