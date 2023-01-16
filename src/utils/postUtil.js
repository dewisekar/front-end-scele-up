const countPostStatistic = (data, fields) => {
  const { views, followers, shares, comments, costPerSlot } = data
  const Scores = {
    viewsPerFollowers: Math.round((views / followers) * 1000 * 100) / 100,
    commentsPerFollowers: Math.round((comments / followers) * 30000 * 100) / 100,
    sharesPerFollowers: Math.round((shares / followers) * 50000 * 100) / 100,
    costPerViews: Math.round((costPerSlot / views) * 100) / 100,
    cpm: Math.round((costPerSlot / views) * 1000 * 100) / 100,
  }

  let result = {}
  fields.forEach((field) => {
    result[field] = Scores[field]
  })

  return result
}

export { countPostStatistic }
