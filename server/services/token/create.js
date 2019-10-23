const Boom = require('boom')
const authToken = require('../../auth/token')
const store = require('../../store')

const ADMINS = JSON.parse(process.env.CFP_VOTE_ADMINS || '[]')

module.exports = async function ({ payload }) {
  const { token } = payload
  const githubId = await store.get(token)

  if (!githubId) {
    return Boom.unauthorized('No GitHub user here for that cookie')
  }

  const id = await store.get(githubId)

  if (!id) {
    return Boom.unauthorized('No user here for that GitHub user')
  }

  const client = await store.get(id)
  const jwt = await authToken.create({
    sub: id,
    login: client.login
  }, client.secret)

  // console.log('token create', client, ADMINS);

  const admin = ADMINS.includes(client.login)

  return {
    jwt,
    admin,
    login: client.login,
    name: client.name
  }
}
