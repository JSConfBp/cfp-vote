const store = require('../../../../store')
const { getStagedTalksKey } = store.keys

const {
  getData,
} = require('../../../../lib/sessionize')

const getCFPData = async (store) => {
  const url = await store.hget('sessionize', 'api-url')
  const selectedFields = await store.hget('sessionize', 'fields')

  const data = await getData(url)

  return data.sessions.map(session => {
      const talk_id = session.id

    return selectedFields.reduce((talk, { field, id }) => {
      if (!talk[talk_id]) talk[talk_id] = {}

      if (id === 's_0') {
        talk[talk_id][field] = session.title
      }
      if (id === 's_1') {
        talk[talk_id][field] = session.description
      }

      // todo more fields?

      return talk
    }, {})
  })
}

module.exports = async ({ body }) => {

  const stage = await store.get('stage')
  const cfpData = await getCFPData(store)
  const stagedTalkKey = getStagedTalksKey(stage)

  const existing = (await store.getkeys('sessionize_*')).map(key => key.replace('sessionize_', ''))

  const data = cfpData.filter(obj => {
    const id = Object.keys(obj)
    return !existing.includes(id[0]);
  })

  for (const cfp of data) {
    const id = Object.keys(cfp)
    const data = cfp[id]

    const internalId = `sessionize_${id}`

    Object.entries(data).forEach(async ([key, value]) => {
      await store.hset(internalId, key, value)
    })
    await store.rpush(stagedTalkKey, internalId)
  }

  return {
    success: true,
  }
}
