const fetch =  require('isomorphic-unfetch')
const store = require('../../store')
const ADMINS = JSON.parse(process.env.ADMINS)

module.exports = async function () {
  const storedUsers = await store.smembers('users')
  const allUsers = storedUsers.concat(ADMINS)
  try {
    const data = allUsers.map(user => ({ login: user }))
    const users = data.map(user => {
      if (ADMINS.includes(user.login)) {
        user.admin = true
      }
      return user
    })

    return users
  } catch(e) {
    console.error(e)
    throw e
  }
}
