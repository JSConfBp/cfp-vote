import { lrange, getUserStagedVotesKey } from '../store'
import cfpConfig from '../../cfp.config'
import getUsers from '../users/read'
import getStagedVotedTalks from '../../lib/getStagedVotedTalks'

export default async function () {
  const users = (await getUsers()).map(user => user.login);
  const stages = Object.keys(cfpConfig.votingStages).map(stage => getVoteHistogram(users, stage, cfpConfig.votingStages[stage].voteUI))

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

const getVoteHistogram = async (users, stageId, stageConfig) => {
  const buckets = stageConfig.map(stage => Object.assign({}, stage, { count: 0}));

  await Promise.all(users.map(async (user) => {
    const key = getUserStagedVotesKey(user, stageId)
    const votes = await lrange(key, 0, -1)

    votes.forEach(vote => {
      const voteValue = JSON.parse(vote).value
      const bucket = buckets.find(({ value }) => (value === voteValue))
      bucket.count += 1
    })
  }))

  return {
    stageId,
    buckets
  }
}
