import { llen, lindex, hgetall, hget, get, getUserStagedVotesKey, getStagedTalksKey } from '../store'

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


export default async function (login) {
  const stage = await get('stage')

  const key = getUserStagedVotesKey(login, stage)
  const nextIndex = await llen(key)

  const stagedTalksKey = getStagedTalksKey(stage)

  const total = await llen(stagedTalksKey)

  const data = {
    fields: {},
    completed: false
  }

  if (nextIndex >= total) {
    data.completed = true
    return data
  }

  const nextId = await lindex(stagedTalksKey, nextIndex)
  const nextTalk = await hgetall(nextId)
  const fields = {
    imported: await hget('import', 'fields'),
    gsheet: await hget('gsheet', 'fields'),
    sessionize: await hget('sessionize', 'fields')
  }

  data.id = nextId

  let fieldType = nextId.split('_')[0]


  data.fields = fields[fieldType].reduce((obj, {field}) => {
    obj[field] = cleanup(nextTalk[field])
    return obj
  }, {})

  return data
}
