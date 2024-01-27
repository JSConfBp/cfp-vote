import getUsers from '../users/read'
import getStagedVotedTalks from '../../lib/getStagedVotedTalks'
import { set, get, llen, rpush, del, getUserStagedVotesKey, getStagedTalksKey } from '../store'

export default async function (stage, topCount) {
  if (stage) {
    const previousStage = await get('stage')

    const count = await updateStage(previousStage, stage, topCount)
    await set('stage', stage)
    return { count, stage }
  }
}

const updateStage = async (from, to, topCount) => {

  if (from === to) {
    return llen(getStagedTalksKey(from))
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

  await rpush(getStagedTalksKey(newStage), shuffledShortListIds)

  return shuffledShortListIds.length
}

const updateToStage1 = async (previousStage, newStage) => {
  await del(getStagedTalksKey(previousStage))

  const users = (await getUsers()).map(user => user.login)

  // remove stage 2 votes as well
  await Promise.all(users.map(async (user) => {
    const key = getUserStagedVotesKey(user, previousStage)
    await del(key)
  }))

  return llen(getStagedTalksKey(newStage))
}
