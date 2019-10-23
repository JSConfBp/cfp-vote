const { read } = require('../../../services/talk')
const TalkReadResponse = require('../../responses/TalkRead')

module.exports = {
  method: 'GET',
  path: '/talk',
  options: {
    auth: 'jwt'
  },
  handler: async (request, h) => {
    const data = await read(request)
    return TalkReadResponse(data)
  }
}
