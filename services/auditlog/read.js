import { lrange } from '../store'

export default async function () {
  const data = await lrange('auditlog', 0, -1)

  return data.map(line => JSON.parse(line))
}
