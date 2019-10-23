const { fields } = require('../../../../services/cfp/import')

module.exports = {
  method: 'POST',
  path: '/cfp/import/fields',
  options: {
    auth: 'admin',
    payload: {
      allow: 'application/json'
    }
  },
  handler: async (request, h) => {
    const data = await fields(request)
    return data
  }
}
