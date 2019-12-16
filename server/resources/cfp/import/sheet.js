const { sheet } = require('../../../services/cfp/import')

module.exports = async (request, response) => {
  const data = await sheet(request)
  response.send(data)
}
