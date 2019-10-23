
exports.getStagedTalksKey = (stage) => {
  return `talks-${stage}`
}

exports.getUserStagedVotesKey = (user, stage) => {
  return `votes-${stage}-${user}`
}
