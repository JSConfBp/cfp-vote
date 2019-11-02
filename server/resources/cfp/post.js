const { create } = require('../../services/cfp')

module.exports = async (request, response) => {
  const data = await create(request.headers, request.body)
  response.send(data)
}
