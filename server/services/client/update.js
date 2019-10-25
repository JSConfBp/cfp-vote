const dayjs = require('dayjs')
const store = require('../../store')

module.exports = async function ({ payload, auth }) {
  const { id } = auth.credentials || {}

  const data = store.get(id)

  data.secret = payload.secret
  data.updated_at = dayjs().unix()

  store.set(id, data)

  return data
}
