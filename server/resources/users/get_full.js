const { read_full } = require('../../services/users')

module.exports = async (request, response) => {
  const data = await read_full(request)
  response.send(data)
}
