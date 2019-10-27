const { update } = require('../../services/cfp')
const CfpUpdateResponse = require('../../responses/CfpUpdate')

module.exports = async (request, response) => {
  const data = await update(request)
  response.send(CfpUpdateResponse(data))
}

