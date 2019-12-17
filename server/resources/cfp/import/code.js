const { code } = require('../../../services/cfp/import')
const auditlog = require('../../../auth/auditlog')

module.exports = async (request, response) => {
  const { login } = request.user
  auditlog(login, `authenticated to google sheets`)

  const data = await code(request)
  response.send(data)
}
