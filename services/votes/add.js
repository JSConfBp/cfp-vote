import { rpush, get, getUserStagedVotesKey } from '../store'

export default async function (login, vote) {
  const stage = await get('stage')
  const key = getUserStagedVotesKey(login, stage)

  await rpush(key, JSON.stringify(vote))

  return { success: true }
}
