const { remove } = require('../../services/cfp')
const auditlog = require('../../auth/auditlog')

module.exports = async (request, response) => {
  const { login } = request.user
  auditlog(login, `delete cfp`)

  const data = await remove(request)
  response.send(data)
}
