const { activate } = require('../../../services/cfp/import')

module.exports = async (request, response) => {
  const data = await activate(request)
  response.send(data)
}
