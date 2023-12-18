import { lrange, del, getStagedTalksKey, getUserStagedVotesKey } from '../store'
import getUsers from '../users/read'
import cfpConfig from '../../cfp.config'

export default async function () {

  const talkIds = await Promise.all(
    Object
      .keys(cfpConfig.votingStages)
      .map(stage => getStagedTalksKey(stage))
      .map(key => lrange(key, 0, -1))
  )

  await Promise.all(
    talkIds.map(stageIds => {
      if (stageIds.length < 1) {
        return Promise.resolve()
      }
      return del(stageIds)
    })
  )

  await del(
    Object
      .keys(cfpConfig.votingStages)
      .map(stage => getStagedTalksKey(stage))
  )

  await del('stage')
  await del('sessionize')
  await del('gsheet')
  await del('imported')

  const users = await getUsers()

  await del(
    Object
      .keys(cfpConfig.votingStages)
      .reduce((arr, stage) => {
        return arr.concat(users.map(({login}) => getUserStagedVotesKey(login, stage)))
      }, [])
  )

  return { success: true }
}
