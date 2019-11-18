const store = require('../../store')
const auditlog = require('../../auth/auditlog')

module.exports = async function (request) {
  const {
    body: data,
    user: { login }
  } = request

  auditlog(login, `remove user ${data.user}`)
  await store.srem('users', data.user)

  return { success: true }
}
