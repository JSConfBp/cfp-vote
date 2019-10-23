const Boom = require('boom')
const { read } = require('../../../services/client')

const ClientResponse = require('../../responses/Client')

module.exports = {
  method: 'GET',
  path: '/client/{id}',
  options: {
    auth: 'jwt'
  },
  handler: async (request, h) => {
    const data = await read(request)

    if (!data) {
      throw Boom.notFound()
    }
    return ClientResponse(data)
  }
}
