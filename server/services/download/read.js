const store = require('../../store')
const votingStages = require('../../../cfp.config').voting_stages
const votingUi = require('../../../cfp.config').voting_ui
const USERS = JSON.parse(process.env.CFP_VOTE_USERS || '[]')
const { getUserStagedVotesKey, getStagedTalksKey } = store.keys

const csv = require('csv')

const getVoteDataFromAllUsers = async (stage) => {
  return Promise.all(USERS.map(async (user) => {
    const key = getUserStagedVotesKey(user, stage)
    const votes = await store.lrange(key, 0, -1)
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

  const shortListFields = votingUi['stage_2'].reduce((obj, stageVote) => {
    obj[stageVote.label] = stageVote.value
    return obj
  }, {})

  // meh: 1
  // yay: 2
  // must: 3

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

module.exports = async function (request) {
  const talks = await store.lrange(getStagedTalksKey('stage_1'), 0, -1)

  const stage1Votes = await getStageVotes('stage_1', talks)
  const stage2Votes = await getStageVotes('stage_2', talks)
  const shortListDetailedCount = await getShortListDetailedCount(talks)

  const talkData = await Promise.all(talks.map((talkId) => {
    return store.hgetall(talkId).then((result) => {
      result.__id = talkId

      result[votingStages['stage_1'].label] = stage1Votes.find((data) => (data.talk === talkId)).votes
      result[votingStages['stage_2'].label] = stage2Votes.find((data) => (data.talk === talkId)).votes

      // include a count of how many meh/yay/must a talk got
      const shortListDetails = shortListDetailedCount.find((data) => (data.talk === talkId)).shortListDetails

      Object.entries(shortListDetails).forEach(([label, value]) => {
        result[label] = value
      })

      return result
    })
  }))

  const exportCsv = await new Promise((resolve, reject) => {
    csv.stringify(
      talkData,
      {
        header: true
      },
      (err, result) => {
        if (err) return reject(err)

        resolve(result)
      }
    )
  })

  return exportCsv
}
