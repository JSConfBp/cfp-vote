const store = require('../../store')

module.exports = async function (request) {
  const { body } = request
 
  await Promise.all(Object.entries(body).map(([setting, value]) => {
    return store.hset('settings', setting, value)
  }))

  return { success: true }
}
