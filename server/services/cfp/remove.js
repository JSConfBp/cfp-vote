const store = require('../../store')
const { read: getUsers } = require('../users')
const {
  getStagedTalksKey,
  getUserStagedVotesKey
} = store.keys
const cfpConfig = require('../../../cfp.config')

module.exports = async function () {

  const talkIds = await Promise.all(
    Object
      .keys(cfpConfig.votingStages)
      .map(stage => getStagedTalksKey(stage))
      .map(key => store.lrange(key, 0, -1))
  )

  await Promise.all(
    talkIds.map(stageIds => {
      if (stageIds.length < 1) {
        return Promise.resolve()
      }
      return store.del(stageIds)
    })
  )

  await store.del(
    Object
      .keys(cfpConfig.votingStages)
      .map(stage => getStagedTalksKey(stage))
  )

  await store.del('stage')
  await store.del('fields')
  await store.del('gsheet')

  const users = await getUsers()

  await store.del(
    Object
      .keys(cfpConfig.votingStages)
      .reduce((arr, stage) => {
        return arr.concat(users.map(({login}) => getUserStagedVotesKey(login, stage)))
      }, [])
  )

  return { success: true }
}
