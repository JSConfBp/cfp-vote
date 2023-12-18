const store = require('../../../../store')
const { getData, getFields } = require('../../../../lib/sessionize')

module.exports = async function ({ headers, body: { url } }) {
  await store.hset('sessionize', 'api-url', url)

  const data = await getData(url)
  const fields = getFields(data)

  return {
    needAuth: false,
    fields
  }
}
