const moment = require('moment')
const store = require('../../store')

module.exports = async function ({ payload, auth }) {
  const { id } = auth.credentials || {}

  const data = store.get(id)

  data.secret = payload.secret
  data.updated_at = moment().unix()

  store.set(id, data)

  return data
}
