const { remove } = require('../../../services/client')

module.exports = {
  method: 'DELETE',
  path: '/client/{id}',
  options: {
    payload: {
      allow: 'application/json'
    },
    auth: 'jwt'
  },
  handler: async (request, h) => {
    await remove(request)

    return h.code(201)
  }
}
