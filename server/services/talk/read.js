const store = require('../../store')
const { getUserStagedVotesKey, getStagedTalksKey } = store.keys

module.exports = async function (request) {
  const { login } = request.user

  const stage = await store.get('stage')

  const key = getUserStagedVotesKey(login, stage)
  const nextIndex = await store.llen(key)

  const stagedTalksKey = getStagedTalksKey(stage)

  const total = await store.llen(stagedTalksKey)

  const data = {
    fields: {},
    completed: false
  }

  if (nextIndex >= total) {
    data.completed = true
    return data
  }

  const nextId = await store.lindex(stagedTalksKey, nextIndex)
  const nextTalk = await store.hgetall(nextId)
  const fields = await store.get('fields')

  data.id = nextId
  data.fields = fields.reduce((obj, field) => {
    obj[field] = nextTalk[field]
    return obj
  }, {})

  return data
}
