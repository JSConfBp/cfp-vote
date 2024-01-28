import { lrange, del, getStagedTalksKey, getUserStagedVotesKey, getkeys } from '../store'
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

  await del('stage')
  await del('sessionize')
  await del('gsheet')
  await del('import')

  const talks = await getkeys('imported_*')
  for (let key of talks) {
    await del(key)
  }

  const gtalks = await getkeys('gsheet_talk*')
  for (let key of gtalks) {
    await del(key)
  }

  const talks_stage = await getkeys('talks-stage*')
  for (let key of talks_stage) {
    await del(key)
  }

  const votes_stage = await getkeys('votes-stage*')
  for (let key of votes_stage) {
    await del(key)
  }

  return { success: true }
}
