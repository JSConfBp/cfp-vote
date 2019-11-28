const { create } = require('../../services/users')
const auditlog = require('../../auth/auditlog')

module.exports = async (request, response) => {
  const {
    user: { login },
    body: { login: newUser }
  } = request

  auditlog(login, `add user ${newUser}`)
  const data = await create(newUser)
  response.send(data)
}

