const { remove } = require('../../services/cfp')

module.exports = async (request, response) => {
  const data = await remove(request)
  response.send(data)
}
