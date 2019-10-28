const { post } = require('../../services/vote')

module.exports = async (request, response) => {
  const data = await post(request)

  response.send(data)
}
