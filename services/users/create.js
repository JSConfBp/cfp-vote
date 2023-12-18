import { sadd, sismember} from '../store'
import getAdmins from '../admins/get'

export default async function (login) {
  const admins = getAdmins();
  const exists = admins.includes(login) || await sismember('users', login)

  if (exists) {
    return { success: true }
  }
  await sadd('users', login)

  return { success: true }
}
