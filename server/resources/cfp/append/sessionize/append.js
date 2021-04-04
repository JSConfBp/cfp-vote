const { append } = require('../../../../services/cfp/append/sessionize')

module.exports = async (request, response) => {
  const data = await append(request)
  response.send(data)
}
