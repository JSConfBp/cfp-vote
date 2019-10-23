const { create } = require('../../../services/client')
const ClientCreatedResponse = require('../../responses/ClientCreated')

module.exports = {
  method: 'POST',
  path: '/client',
  options: {
    auth: false,
    payload: {
      allow: 'application/json'
    }
  },
  handler: async (request, h) => {
    const data = await create(request)
    return ClientCreatedResponse(data)
  }
}
