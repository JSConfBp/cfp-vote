const { activate } = require('../../../../services/cfp/import')

module.exports = {
  method: 'POST',
  path: '/cfp/import/activate',
  options: {
    auth: 'admin',
    payload: {
      allow: 'application/json'
    }
  },
  handler: async (request, h) => {
    const data = await activate(request)
    return data
  }
}
