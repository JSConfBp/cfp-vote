const store = require('../../store')
const { getStagedTalksKey } = store.keys

module.exports = async function () {
  const stage = await store.get('stage')
  const fields = await store.get('fields')
  const count = await store.llen(getStagedTalksKey(stage))

  return { 
    count, 
    stage, 
    fields: JSON.parse(fields) 
  }
}
