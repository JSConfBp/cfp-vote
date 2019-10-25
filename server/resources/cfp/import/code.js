const { code } = require('../../../../services/cfp/import')

module.exports = {
  method: 'POST',
  path: '/cfp/import/code',
  options: {
    auth: 'admin',
    payload: {
      allow: 'text/plain'
    }
  },
  handler: async (request, h) => {
    const data = await code(request)
    return data
  }
}
