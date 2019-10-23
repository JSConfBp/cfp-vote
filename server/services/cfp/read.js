const store = require('../../store')
const { getStagedTalksKey } = store.keys

module.exports = async function () {
  const year = await store.get('year')
  const stage = await store.get('stage')
  const count = await store.llen(getStagedTalksKey(stage))

  return { year, count, stage }
}
