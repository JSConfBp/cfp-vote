const { create } = require('../../services/cfp')
const CfpCreatedResponse = require('../../responses/CfpCreated')

module.exports = async (request, response) => {
  const data = await create(request)
  response.send(CfpCreatedResponse(data))
}
