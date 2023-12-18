
export const getStagedTalksKey = (stage) => {
  return `talks-${stage}`
}

export const getUserStagedVotesKey = (user, stage) => {
  return `votes-${stage}-${user}`
}
