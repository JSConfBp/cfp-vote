const { create } = require('../../services/cfp')
const CfpCreatedResponse = require('../../responses/CfpCreated')

module.exports = async (request, response) => {
  const data = await create(request.headers, request.body)
  response.send(CfpCreatedResponse(data))
}
