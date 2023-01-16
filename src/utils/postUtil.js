const countPostStatistic = (data, fields) => {
  const { views, followers, shares, comments, costPerSlot } = data
  const Scores = {
    viewsPerFollowers: (views / followers) * 100,
    commentsPerFollowers: (comments / followers) * 30000,
    sharesPerFollowers: (shares / followers) * 50000,
    costPerViews: costPerSlot / views,
    cpm: (costPerSlot / views) * 1000,
  }

  let result = {}
  fields.forEach((field) => {
    result[field] = Math.round(Scores[field] * 100) / 100
  })

  return result
}

export { countPostStatistic }
