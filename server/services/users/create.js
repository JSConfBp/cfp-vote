const store = require('../../store')
const auditlog = require('../../auth/auditlog')

module.exports = async function (request) {
  const {
    body: data,
    user: { login }
  } = request

  auditlog(login, `add user ${data.login}`)
  await store.sadd('users', data.login)

  return { success: true }
}
