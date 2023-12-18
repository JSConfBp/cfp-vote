import { srem } from '../store'

export default async function (login) {

  await srem('users', login)

  return { success: true }
}
