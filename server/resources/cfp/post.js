const { create } = require('../../services/cfp')
const auditlog = require('../../auth/auditlog')

module.exports = async (request, response) => {
  const { login } = request.user
  auditlog(login, `upload new cfp`)

  const data = await create(request.headers, request.body)
  response.send(data)
}
