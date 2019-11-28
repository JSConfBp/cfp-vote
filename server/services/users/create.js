const store = require('../../store')
const auditlog = require('../../auth/auditlog')
const ADMINS = JSON.parse(process.env.ADMINS)

module.exports = async function (login) {
  const exists = ADMINS.includes(login) || await store.sismember('users', login)

  if (exists) {
    return { success: true }
  }

  auditlog(login, `add user ${login}`)
  await store.sadd('users', login)

  return { success: true }
}
