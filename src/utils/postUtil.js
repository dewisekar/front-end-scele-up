const countPostStatistic = (data, fields) => {
  console.log(data)
  const { views, followers, shares, comments, costPerSlot, likes } = data
  const engagementPoint = 1 * views + 3 * likes + 5 * shares
  const Scores = {
    viewsPerFollowers: followers === '0' ? 0 : (views / followers) * 100,
    commentsPerFollowers: followers === '0' ? 0 : (comments / followers) * 30000,
    sharesPerFollowers: followers === '0' ? 0 : (shares / followers) * 50000,
    costPerViews: views === '0' ? 0 : costPerSlot / views,
    cpm: views === '0' ? 0 : (costPerSlot / views) * 1000,
    engagementPoint: engagementPoint,
    marketReadiness: engagementPoint / 22,
    marketReadinessPerViews: views === '0' ? 0 : engagementPoint / 22 / views,
    engagementPointPerViews: views === '0' ? 0 : engagementPoint / views,
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
