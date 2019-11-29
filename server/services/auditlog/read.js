const store = require('../../store')


module.exports = async function () {
  const data = await store.lrange('auditlog', 0, -1)

  return data.map(line => JSON.parse(line))
}
