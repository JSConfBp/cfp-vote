import { hgetall, lrange, getStagedTalksKey, getUserStagedVotesKey } from '../store'
import cfpConfig from '../../cfp.config'
import getUsers from '../users/read'

const getVoteDataFromAllUsers = async (stage) => {
  const users = (await getUsers()).map(user => user.login)

  return Promise.all(users.map(async (user) => {
    const key = getUserStagedVotesKey(user, stage)
    const votes = await lrange(key, 0, -1)
    const voteValuePairs = votes.reduce((obj, vote) => {
      if (vote) {
        const { id, value } = (JSON.parse(vote))
        obj[id] = value
      }
      return obj
    }, {})

    return {
      user,
      votes: voteValuePairs
    }
  }))
}

const getStageVotes = async (stage, talks) => {
  const voteData = await getVoteDataFromAllUsers(stage)

  return talks.map((talk) => {
    const votes = voteData.reduce((sum, data) => {
      if (data.votes && data.votes[talk]) {
        sum += data.votes[talk]
      }
      return sum
    }, 0)

    return {
      talk,
      votes
    }
  })
}

const getShortListDetailedCount = async (talks) => {
  const voteData = await getVoteDataFromAllUsers('stage_2')

  const shortListFields = cfpConfig.votingStages['stage_2'].voteUI.reduce((obj, stageVote) => {
    obj[stageVote.label] = stageVote.value
    return obj
  }, {})

  return talks.map((talk) => {
    const details = Object.entries(shortListFields).reduce((obj, [label]) => {
      obj[label] = 0
      return obj
    }, {})

    const shortListDetails = voteData.reduce((details, data) => {
      const currentVoteArray = Object.entries(data.votes).filter(([voteId, voteValue]) => {
        return voteId === talk
      })

      const currentVote = currentVoteArray[0] ? currentVoteArray[0][1] : 0

      if (currentVote === shortListFields.meh) details.meh += 1
      if (currentVote === shortListFields.yay) details.yay += 1
      if (currentVote === shortListFields.MUST) details.MUST += 1

      return details
    }, details)

    return {
      talk,
      shortListDetails
    }
  })
}

export default async function download () {
  const talks = await lrange(getStagedTalksKey('stage_1'), 0, -1)

  const stage1Votes = await getStageVotes('stage_1', talks)
  const stage2Votes = await getStageVotes('stage_2', talks)
  const shortListDetailedCount = await getShortListDetailedCount(talks)

  const talkData = await Promise.all(talks.map((talkId) => {
    return hgetall(talkId).then((result) => {
      result.__id = talkId

      result[cfpConfig.votingStages['stage_1'].label] = stage1Votes.find((data) => (data.talk === talkId)).votes
      result[cfpConfig.votingStages['stage_2'].label] = stage2Votes.find((data) => (data.talk === talkId)).votes

      // include a count of how many meh/yay/must a talk got
      const shortListDetails = shortListDetailedCount.find((data) => (data.talk === talkId)).shortListDetails

      Object.entries(shortListDetails).forEach(([label, value]) => {
        result[label] = value
      })

      return result
    })
  }))

  return talkData
}
