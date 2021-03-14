const store = require('../../store')
const { getUserStagedVotesKey, getStagedTalksKey } = store.keys


const cleanup = (data) => {
  try {
    return data
        .replace(/^"/gm, '')
        .replace(/"$/gm, '')
        //.replace(/\\n\\n/gm, "\n\n")
        .replace(/\\n ?\\n/gm, "\n\n")
        .replace(/\\n/gm, "\n\n")
        .replace(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gm, 'REDACTED_URL')
  } catch(e) {
    return data
      .replace(/^"/gm, '')
      .replace(/"$/gm, '')
      .replace(/\\n\\n/gm, "\n\n")
  }
}


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
  const fields = {
    gsheet: await store.hget('gsheet', 'fields'),
    sessionize: await store.hget('sessionize', 'fields')
  }

  data.id = nextId

  let fieldType = nextId.split('_')[0]

  data.fields = fields[fieldType].reduce((obj, {field}) => {
    obj[field] = cleanup(nextTalk[field])
    return obj
  }, {})

  return data
}
