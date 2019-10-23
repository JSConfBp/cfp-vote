const store = require('../../store')

const USERS = JSON.parse(process.env.CFP_VOTE_USERS || '[]')
const { getUserStagedVotesKey, getStagedTalksKey } = store.keys

module.exports = async function () {
  const stage = await store.get('stage')
  const total = await store.llen(getStagedTalksKey(stage))

  const data = await Promise.all(USERS.map(async (user) => {
    const key = getUserStagedVotesKey(user, stage)
    const count = await store.llen(key)

    return {
      user,
      total,
      count
    }
  }))

  return data
}
