const { sheet } = require('../../../../services/cfp/import')

module.exports = {
  method: 'POST',
  path: '/cfp/import/sheet',
  options: {
    auth: 'admin',
    payload: {
      allow: 'application/json'
    }
  },
  handler: async (request, h) => {
    const data = await sheet(request)
    return data
  }
}
