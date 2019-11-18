const store = require('../../store')

module.exports = async function (request) {
  const data = await store.hgetall('settings')

  if (!data) return {}

  const result = Object.entries(data).reduce((obj, [key, value]) => {

    if (value === "true") {
      obj[key] = true
    } else if (value === "false") {
      obj[key] = false
    } else {
      obj[key] = value
    }

    return obj
  }, {})

  return result
}
