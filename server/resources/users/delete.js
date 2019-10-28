const { remove } = require('../../services/users')

module.exports = async (request, response) => {
  const data = await remove(request)
  response.send(data)
}
