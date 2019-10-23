const { post } = require('../../../services/vote')
const VotePostResponse = require('../../responses/VotePost')

module.exports = {
  method: 'POST',
  path: '/vote',
  options: {
    auth: 'jwt'
  },
  handler: async (request, h) => {
    const data = await post(request)
    return VotePostResponse(data)
  }
}
