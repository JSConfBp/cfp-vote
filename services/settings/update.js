import { hset } from '../store'

export default async function (body) {
  await Promise.all(Object.entries(body).map(([setting, value]) => {
    return hset('settings', setting, value)
  }))

  return { success: true }
}
