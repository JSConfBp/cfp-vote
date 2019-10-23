const store = require('../../store')

module.exports = async function (id) {
  return store.get(id)
}
