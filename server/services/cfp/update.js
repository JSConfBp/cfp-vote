const store = require('../../store')
const { getUserStagedVotesKey, getStagedTalksKey } = store.keys
const getStagedVotedTalks = require('../../lib/getStagedVotedTalks')

const cfpConfig = require('../../../cfp.config')

module.exports = async function (request) {
  const { payload: { stage, voteLimit } } = request


  if (stage) {
    const previousStage = await store.get('stage')
    const count = await updateStage(previousStage, stage, voteLimit)
    await store.set('stage', stage)
    return { count, stage }
  }
}

const updateStage = async (from, to, voteLimit) => {
  // console.log(`updating stage from ${from} to ${to}`)

  if (to === 'stage_1') {
    return updateToStage1(from, to)
  }

  if (to === 'stage_2') {
    return updateToStage2(from, to, voteLimit)
  }
}

const updateToStage2 = async (previousStage, newStage, voteLimit) => {
  const votedTalks = await getStagedVotedTalks(previousStage)

  // TODO: deprecate this coming from cfpConfig
  const topVotes = voteLimit || cfpConfig.voting_stages[newStage].include_votes_top

  const shortListIds = votedTalks
    .filter(talk => talk.votes >= topVotes)
    .map(obj => obj.talk)

  if (shortListIds.length < 1) {
    return
  }

  // shuffle array
  const shuffledShortListIds = shortListIds.sort(() => (0.5 - Math.random()))

  await store.rpush(getStagedTalksKey(newStage), ...shuffledShortListIds)

  return shuffledShortListIds.length
}

const updateToStage1 = async (previousStage, newStage) => {
  // STAGE 1

  await store.del(getStagedTalksKey(previousStage))

  const USERS = JSON.parse(process.env.CFP_VOTE_USERS || '[]')

  // remove stage 2 votes as well
  await Promise.all(USERS.map(async (user) => {
    const key = getUserStagedVotesKey(user, previousStage)
    await store.del(key)
  }))

  return store.llen(getStagedTalksKey(newStage))
}
