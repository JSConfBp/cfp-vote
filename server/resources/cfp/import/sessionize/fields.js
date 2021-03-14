const { fields } = require('../../../../services/cfp/sessionize/import')
const auditlog = require('../../../../auth/auditlog')

module.exports = async (request, response) => {
  const { login } = request.user
  auditlog(login, `import cfp from sessionize`)

  const data = await fields(request)
  response.send(data)
}
