const { prepare } = require('../../../../services/cfp/append/gsheet')

module.exports = async (request, response) => {
  const data = await prepare(request)
  response.send(data)
}
