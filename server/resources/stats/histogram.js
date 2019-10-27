const { histogram } = require('../../services/stats')

module.exports = async (request, response) => {
  const data = await histogram(request)
  response.send(data)
}

