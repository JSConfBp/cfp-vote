const store = require('../../store')
const { read: getUsers } = require('../users')
const { getUserStagedVotesKey, getStagedTalksKey } = store.keys

module.exports = async function () {
  const users = (await getUsers()).map(user => user.login)
  const stage = await store.get('stage')
  const total = await store.llen(getStagedTalksKey(stage))

  const data = await Promise.all(users.map(async (user) => {
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
