const { read } = require('../../services/stats')

module.exports = async (request, response) => {
  const data = await read(request)
  response.send(data)
}
