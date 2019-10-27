const { create } = require('../../services/users')

module.exports = async (request, response) => {
  const data = await create(request)
  response.send(data)
}

