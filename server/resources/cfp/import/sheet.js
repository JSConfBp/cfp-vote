const { sheet } = require('../../../services/cfp/import')
const auditlog = require('../../../auth/auditlog')

module.exports = async (request, response) => {
  const { login } = request.user
  auditlog(login, `connected to sheets`)

  const data = await sheet(request)
  response.send(data)
}
