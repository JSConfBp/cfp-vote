const store = require('../../store')
const auditlog = require('../../auth/auditlog')
const { read: getUsers } = require('../users')
const { getUserStagedVotesKey, getStagedTalksKey } = store.keys
const getStagedVotedTalks = require('../../lib/getStagedVotedTalks')

const cfpConfig = require('../../../cfp.config')


module.exports = async function (request) {
  const {
    body: { stage, topCount },
    user: { login }
  } = request

  if (stage) {
    auditlog(login, `update cfp stage to ${stage} including the top ${topCount} talks`)

    const previousStage = await store.get('stage')

    const count = await updateStage(previousStage, stage, topCount)
    await store.set('stage', stage)
    return { count, stage }
  }
}


const updateStage = async (from, to, topCount) => {

  if (from === to) {
    return store.llen(getStagedTalksKey(from))
  }

  if (to === 'stage_1') {
    return updateToStage1(from, to)
  }

  if (to === 'stage_2') {
    return updateToStage2(from, to, topCount)
  }
}

const updateToStage2 = async (previousStage, newStage, topCount = 0) => {
  const votedTalks = await getStagedVotedTalks(previousStage)

  const shortListIds = votedTalks
    .sort((a, b) => (b.votes - a.votes))
    .slice(0, topCount)
    .map(obj => obj.talk)

  if (shortListIds.length < 1) {
    return
  }

  const shuffledShortListIds = shortListIds.sort(() => (0.5 - Math.random()))

  await store.rpush(getStagedTalksKey(newStage), ...shuffledShortListIds)

  return shuffledShortListIds.length
}

const updateToStage1 = async (previousStage, newStage) => {
  // STAGE 1

  await store.del(getStagedTalksKey(previousStage))

  const users = (await getUsers()).map(user => user.login)

  // remove stage 2 votes as well
  await Promise.all(users.map(async (user) => {
    const key = getUserStagedVotesKey(user, previousStage)
    await store.del(key)
  }))

  return store.llen(getStagedTalksKey(newStage))
}
