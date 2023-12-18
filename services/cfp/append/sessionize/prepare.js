const store = require('../../../../store')

const {
  cache,
  getData,
} = require('../../../../lib/sessionize')

module.exports = async ({ body }) => {

  const fields = {
    sessionize: await store.hget('sessionize', 'fields')
  }

  const sessionize = !!(await store.hget('sessionize', 'imported'))

  const count = {
    sessionize: 0
  }

  if (sessionize) {
    const url = await store.hget('sessionize', 'api-url')
    await cache.clear(url)
    const data = await getData(url)
    const existing = await store.getkeys('sessionize_*')
    if (data.sessions.length && existing.length) {
      count.sessionize = data.sessions.length - existing.length
    }
  }

  return {
    success: true,
    count,
  }
}
