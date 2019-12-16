const { fields } = require('../../../services/cfp/import')

module.exports = async (request, response) => {
  const data = await fields(request)
  response.send(data)
}
