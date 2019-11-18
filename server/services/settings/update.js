const store = require('../../store')
const auditlog = require('../../auth/auditlog')

module.exports = async function (request) {
  const {
    body,
    user: { login }
  } = request

  await Promise.all(Object.entries(body).map(([setting, value]) => {
    auditlog(login, `update setting ${setting} to ${value}`)
    return store.hset('settings', setting, value)
  }))

  return { success: true }
}
