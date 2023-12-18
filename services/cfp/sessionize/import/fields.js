const store = require('../../../../store')
const cfpConfig = require('../../../../../cfp.config')
const { getData, getFields } = require('../../../../lib/sessionize')

const { getStagedTalksKey } = store.keys

module.exports = async function ({ body: fields }) {
  await store.hset('sessionize', 'fields', fields)
  await setStage(cfpConfig, store)

  const cfpData = await getCFPData(store)
  const stage = await store.get('stage')
  const stagedTalkKey = getStagedTalksKey(stage)

  for (const cfp of cfpData) {
    const id = Object.keys(cfp)
    const data = cfp[id]

    const internalId = `sessionize_${id}`

    Object.entries(data).forEach(async ([key, value]) => {
      await store.hset(internalId, key, value)
    })
    await store.rpush(stagedTalkKey, internalId)
  }

  await store.hset('sessionize', 'imported', true)

  return {
    success: true
  }
}

const setStage = async (cfpConfig, store) => {
  const stage = Object.keys(cfpConfig.votingStages)[0]
  return store.set('stage', stage)
}

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
