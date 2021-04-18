const fetch =  require('isomorphic-unfetch')
const store = require('../../store')
const ADMINS = JSON.parse(process.env.ADMINS)

const getUser = (user) => fetch(`https://api.github.com/users/${user}?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    return data
  })

module.exports = async function () {
  const storedUsers = await store.smembers('users')
  const allUsers = storedUsers.concat(ADMINS)
  try {
    const data = await Promise.all(allUsers.map(user => getUser(user)))

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
