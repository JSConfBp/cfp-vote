const store = require('../../store')

module.exports = async function ({ auth }) {

  // console.log(auth);
  
  const { id } = auth.credentials || {}

  return store.get(id)
}
