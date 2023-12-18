
import { get, llen, getStagedTalksKey, getUserStagedVotesKey } from '../store'
import getUsers from '../users/read'


export default async function () {
  const users = (await getUsers()).map(user => user.login)
  const stage = await get('stage')
  const total = await llen(getStagedTalksKey(stage))

  return Promise.all(users.map(async (user) => {
    const key = getUserStagedVotesKey(user, stage)
    const count = await llen(key)

    return {
      user,
      total,
      count
    }
  }))
}
