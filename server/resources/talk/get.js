const { read } = require('../../services/talk')

module.exports = async (request, response) => {
  const data = await read(request)

  response.send(data)
}
