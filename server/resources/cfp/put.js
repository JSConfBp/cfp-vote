const { update } = require('../../services/cfp')

module.exports = async (request, response) => {
  const data = await update(request)
  response.send(data)
}

