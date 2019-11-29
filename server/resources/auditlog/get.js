const { read } = require('../../services/cfp')

module.exports = async (request, response) => {
  const data = await read(request)
  response.send(data)
}
