const { prepare } = require('../../../services/cfp/append')

module.exports = async (request, response) => {
  const data = await prepare(request)
  response.send(data)
}
