const client = require('./client')
const token = require('./token')
const cfp = require('./cfp')
const stats = require('./stats')
const talk = require('./talk')
const vote = require('./vote')
const download = require('./download')

exports.register = async function (server) {
  const basePath = process.env.SERVICE_BASEPATH || ''

  const registered = await server.register([client, token, cfp, stats, talk, vote, download], {
    routes: {
      prefix: basePath + '/v1'
    }
  })

  return registered
}

exports.name = 'http-routes'
