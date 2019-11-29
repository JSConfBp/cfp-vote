const { read } = require('../../services/auditlog')

module.exports = async (request, response) => {
  const data = await read(request)
  response.send(data)
}
