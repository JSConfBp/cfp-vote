const { activate } = require('../../../../services/cfp/sessionize/import')
const auditlog = require('../../../../auth/auditlog')

module.exports = async (request, response) => {
  const { login } = request.user

  auditlog(login, `activate sessionize connection`)

  const data = await activate(request)
  response.send(data)
}
