const store = require('../../store')

module.exports = async function (request) {
  const { body: data } = request
  
  await store.sadd('users', data.login)
  
  return { success: true }
}
