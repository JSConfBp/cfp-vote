const { read } = require('../../../services/stats')
const StatsReadResponse = require('../../responses/StatsRead')

module.exports = {
  method: 'GET',
  path: '/stats',
  options: {
    auth: 'jwt'
  },
  handler: async (request, h) => {
    const data = await read(request)
    return StatsReadResponse(data)
  }
}
