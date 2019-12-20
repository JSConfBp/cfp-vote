const { fields } = require('../../../services/cfp/import')
const auditlog = require('../../../auth/auditlog')

module.exports = async (request, response) => {
  const { login } = request.user
  auditlog(login, `import cfp from google sheets`)

  const data = await fields(request)
  response.send(data)
}
