const { remove } = require('../../../services/cfp')
const CfpUpdateResponse = require('../../responses/CfpUpdate')

module.exports = {
  method: 'DELETE',
  path: '/cfp',
  options: {
    auth: 'admin',
    payload: {
      allow: 'application/json'
    }
  },
  handler: async (request, h) => {
    const data = await remove(request)
    return CfpUpdateResponse(data)
  }
}
