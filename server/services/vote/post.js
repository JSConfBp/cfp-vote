const store = require('../../store')
const getLoginName = require('../../auth/loginName')
const { getUserStagedVotesKey } = store.keys

module.exports = async function (request) {
  const { payload: vote } = request
  const login = await getLoginName(request)
  const stage = await store.get('stage')

  const key = getUserStagedVotesKey(login, stage)

  await store.rpush(key, JSON.stringify(vote))

  return { success: true }
}
