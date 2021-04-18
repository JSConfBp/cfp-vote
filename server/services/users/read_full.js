const fetch =  require('isomorphic-unfetch')
const store = require('../../store')
const ADMINS = JSON.parse(process.env.ADMINS)

const getUser = (user) => {

  console.log("fetch user data ", user)
  return fetch(`https://api.github.com/users/${user}?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`)
    .then(res => res.json())
    .then(data => {
      return data
    })
}

module.exports = async function () {
  const storedUsers = await store.smembers('users')
  const allUsers = storedUsers.concat(ADMINS)
  try {
    // careful, this can hit GH ratelimits
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
