module.exports = async function ({ auth }) {
  const { id } = auth.credentials || {}
  delete global.clients[id]
}
