const store = require('../../store')
const { getStagedTalksKey } = store.keys

module.exports = async function () {
  const stage = await store.get('stage')

  const fields = {
    gsheet: await store.hget('gsheet', 'fields'),
    sessionize: await store.hget('sessionize', 'fields')
  }

  const count = await store.llen(getStagedTalksKey(stage))
  const gsheet = !!(await store.hget('gsheet', 'imported'))
  const sessionize = !!(await store.hget('sessionize', 'imported'))

  return {
    count,
    stage,
    fields,
    gsheet,
    sessionize
  }
}
