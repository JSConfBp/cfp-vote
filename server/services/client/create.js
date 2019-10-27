const uuid = require('uuid/v4')
const dayjs = require('dayjs')
const { promisify } = require('util')
const crypto = require('crypto')
const tokenAuth = require('../../auth/token')
const store = require('../../store')

const getRegisteredUser = async (token, githubId) => {
  const registeredGithubId = await store.get(token)
  const id = await store.get(registeredGithubId || githubId)

  return id
}

module.exports = async function (payload) {
  let id = uuid()
  const buf = await promisify(crypto.randomBytes)(256)
  const secret = buf.toString('hex')
  const { token, id: githubId, displayName, username } = payload

  const data = {
    id,
    login: username,
    githubId,
    secret,
    name: displayName,
    updated_at: dayjs().unix(),
    created_at: dayjs().unix()
  }

  const user = {
    id,
    login: username,
    name: displayName,
  }

  const alreadyRegisteredId = await getRegisteredUser(token, githubId)

  if (alreadyRegisteredId) {
    store.set(token, githubId)

    id = alreadyRegisteredId

    const alreadyRegisteredData = await store.get(alreadyRegisteredId)
    const jwt = await tokenAuth.create({
      sub: alreadyRegisteredId
    }, alreadyRegisteredData.secret)

    if (process.env.DEBUG) {
      console.info('Client already registered once')
    }

    return Object.assign({}, user, { jwt, id })
  }

  store.set(token, githubId)
  store.set(githubId, id)
  store.set(id, data)

  const jwt = await tokenAuth.create({
    sub: id
  }, secret)

  return Object.assign({}, user, { jwt })
}
