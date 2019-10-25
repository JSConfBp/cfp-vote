const { create } = require('../../services/client')
const ClientCreatedResponse = require('../../responses/ClientCreated')

module.exports = async (request, response) => {
  const data = await create(request)
  response.send(ClientCreatedResponse(data))
}
