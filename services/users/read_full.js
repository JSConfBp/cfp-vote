import { smembers } from '../store'
import getAdmins from '../admins/get'

const getUser = (user) => {

  return fetch(`https://api.github.com/users/${user}?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`)
    .then(res => res.json())
    .then(data => {
      return data
    })
}

export default async function () {
  const admins = getAdmins()
  const storedUsers = await smembers('users')
  const allUsers = storedUsers.concat(admins)
  try {
    // careful, this can hit GH ratelimits
    const data = await Promise.all(allUsers.map(user => getUser(user)))

    const users = data.map(user => {
      if (admins.includes(user.login)) {
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
