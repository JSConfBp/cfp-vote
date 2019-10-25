const tokenService = require('../../../services/token')
const TokenCreatedResponse = require('../../responses/TokenCreated')

module.exports = {
  method: 'POST',
  path: '/token',
  options: {
    auth: false,
    payload: {
      allow: 'application/json'
    }
  },
  handler: async (request, h) => {
    return TokenCreatedResponse(tokenService.create(request))
  }
}
