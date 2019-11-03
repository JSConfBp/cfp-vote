const { update } = require('../../services/settings')

module.exports = async (request, response) => {
  const data = await update(request)
  response.send(data)
}
