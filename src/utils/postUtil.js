const countPostStatistic = (data, fields) => {
  const { views, followers, shares, comments, costPerSlot, likes } = data
  const engagementPoint = 1 * views + 3 * likes + 5 * shares
  const Scores = {
    viewsPerFollowers: (views / followers) * 100,
    commentsPerFollowers: (comments / followers) * 30000,
    sharesPerFollowers: (shares / followers) * 50000,
    costPerViews: costPerSlot / views,
    cpm: (costPerSlot / views) * 1000,
    engagementPoint: engagementPoint,
    marketReadiness: engagementPoint / 22,
    marketReadinessPerViews: engagementPoint / 22 / views,
    engagementPointPerViews: engagementPoint / views,
  }

  let result = {}
  fields.forEach((field) => {
    result[field] = Math.round(Scores[field] * 100) / 100
  })

  return result
}

const roundScore = (score) => {
  return Math.round(score * 100) / 100
}

export { countPostStatistic, roundScore }
