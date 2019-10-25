const { create } = require('../../../services/cfp')
const CfpCreatedResponse = require('../../responses/CfpCreated')

module.exports = {
  method: 'POST',
  path: '/cfp',
  options: {
    auth: 'admin',
    payload: {
      allow: 'text/csv',
      maxBytes: 3145728 // 3MB
    }
  },
  handler: async (request, h) => {
    const data = await create(request)
    return CfpCreatedResponse(data)
  }
}
