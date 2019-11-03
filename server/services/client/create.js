const uuid = require('uuid/v4')
const dayjs = require('dayjs')
const { promisify } = require('util')
const crypto = require('crypto')
const store = require('../../store')

const ADMINS = JSON.parse(process.env.ADMINS)

const getRegisteredUser = async (token, githubId) => {
  const registeredGithubId = await store.get(token)
  const id = await store.get(registeredGithubId || githubId)

  return id
}

const isAdmin = (user) => {
  return ADMINS.includes(user)
}

module.exports = async function (payload) {
  let id = uuid()
  const buf = await promisify(crypto.randomBytes)(256)
  const secret = buf.toString('hex')
  const { token, id: githubId, displayName, username } = payload

  const data = {
    id,
    admin: false,
    login: username,
    githubId,
    secret,
    name: displayName,
    updated_at: dayjs().unix(),
    created_at: dayjs().unix()
  }

  const user = {
    id,
    admin: false,
    login: username,
    name: displayName,
  }

  if (isAdmin(username)) {
    data.admin = user.admin = true
  }

  const alreadyRegisteredId = await getRegisteredUser(token, githubId)

  if (alreadyRegisteredId) {
    store.set(token, githubId)

    id = alreadyRegisteredId

    if (process.env.DEBUG) {
      console.info('Client already registered once')
    }

    return Object.assign({}, user, { id })
  }

  store.set(token, githubId)
  store.set(githubId, id)
  store.set(id, data)

  return Object.assign({}, user)
}
