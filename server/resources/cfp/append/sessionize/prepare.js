const { prepare } = require('../../../../services/cfp/append/sessionize')

module.exports = async (request, response) => {
  const data = await prepare(request)
  response.send(data)
}
