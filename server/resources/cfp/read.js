const { read } = require('../../../services/cfp')
const CfpReadResponse = require('../../responses/CfpRead')

module.exports = {
  method: 'GET',
  path: '/cfp',
  options: {
    auth: 'jwt'
  },
  handler: async (request, h) => {
    const data = await read(request)
    return CfpReadResponse(data)
  }
}
