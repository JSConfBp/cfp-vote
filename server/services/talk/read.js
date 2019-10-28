const store = require('../../store')
const jwt = require('../../auth/token')

const cfpConfig = require('../../../cfp.config')

const FIELDS = cfpConfig.cfp_fields || []

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

  data.id = nextId
  data.fields = FIELDS.reduce((obj, field) => {
    obj[field] = nextTalk[field]
    return obj
  }, {})

  return data
}
