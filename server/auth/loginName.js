const jwt = require('./token')

module.exports = async (request) => {
  const { token } = request.auth.credentials
  const payload = await jwt.decode(token)
  const { login } = payload

  return login
}
