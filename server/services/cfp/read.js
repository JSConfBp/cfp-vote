const store = require('../../store')
const { getStagedTalksKey } = store.keys

module.exports = async function () {
  const stage = await store.get('stage')
  const count = await store.llen(getStagedTalksKey(stage))

  return { count, stage }
}
