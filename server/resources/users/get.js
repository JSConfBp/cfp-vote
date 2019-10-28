const { read } = require('../../services/users')

module.exports = async (request, response) => {
  const data = await read(request)
  response.send(data)
}
