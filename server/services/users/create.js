const store = require('../../store')
const auditlog = require('../../auth/auditlog')

module.exports = async function (login) {
  auditlog(login, `add user ${login}`)
  await store.sadd('users', login)

  return { success: true }
}
