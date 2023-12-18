import { smembers } from '../store'
import getAdmins from '../admins/get'

export default async function () {
  const storedUsers = await smembers('users')
  const admins = getAdmins()
  const allUsers = storedUsers.concat(admins)
  try {
    const data = allUsers.map(user => ({ login: user }))
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
