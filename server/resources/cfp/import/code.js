const { code } = require('../../../services/cfp/import')

module.exports = async (request, response) => {
  const data = await code(request)
  response.send(data)
}
