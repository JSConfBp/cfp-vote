const { activate } = require('../../../services/cfp/import')
const auditlog = require('../../../auth/auditlog')

module.exports = async (request, response) => {
  const { login } = request.user
  auditlog(login, `activate google sheet connection`)

  const data = await activate(request)
  response.send(data)
}
