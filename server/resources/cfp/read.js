const { read } = require('../../services/cfp')
const CfpReadResponse = require('../../responses/CfpRead')

module.exports = async (request, response) => {
  const data = await read(request)
  response.send(CfpReadResponse(data))
}
