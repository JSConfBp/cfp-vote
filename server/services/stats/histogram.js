const store = require('../../store')
const { voting_ui: votingUi } = require('../../../cfp.config')

const getStagedVotedTalks = require('../../lib/getStagedVotedTalks')

const USERS = JSON.parse(process.env.CFP_VOTE_USERS || '[]')

const { getUserStagedVotesKey } = store.keys

module.exports = async function () {
  const stages = Object.keys(votingUi).map(stage => getVoteHistogram(stage, votingUi[stage]))

  const data = {
    votes: {},
    talks: {}
  }

  for await (let stage of stages) {
    data.votes[stage.stageId] = stage.buckets

    const stagedVotedTalks = await getStagedVotedTalks(stage.stageId)

    data.talks[stage.stageId] = stagedVotedTalks
  }

  return data
}

const getVoteHistogram = async (stageId, stageConfig) => {
  const buckets = stageConfig.map(stage => {
    stage.count = 0
    return stage
  })

  await Promise.all(USERS.map(async (user) => {
    const key = getUserStagedVotesKey(user, stageId)
    const votes = await store.lrange(key, 0, -1)

    votes.forEach(vote => {
      const voteValue = JSON.parse(vote).value
      const bucket = buckets.filter(({ value }) => (value === voteValue))
      bucket[0].count += 1
    })
  }))

  return {
    stageId,
    buckets
  }
}
