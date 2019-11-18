const store = require('../store')
const { read: getUsers } = require('../services/users')
const { getUserStagedVotesKey, getStagedTalksKey } = store.keys

module.exports = async function (stage) {
  const users = (await getUsers()).map(user => user.login);
  const talks = await store.lrange(getStagedTalksKey(stage), 0, -1)

  const voteData = await Promise.all(users.map(async (user) => {
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

  const votedTalks = talks.map((talk) => {
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

  return votedTalks.sort((first, second) => {
    return first.votes - second.votes
  }).reverse()
}
