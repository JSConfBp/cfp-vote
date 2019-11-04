const { create } = require('../../services/client')

module.exports = async (request, response) => {
  const data = await create(request)
  response.send(data)
}
