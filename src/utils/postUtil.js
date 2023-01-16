const countPostStatistic = (data, fields) => {
  const { views, followers, shares, comments } = data
  const Scores = {
    viewsPerFollowers: Math.round((views / followers) * 1000 * 100) / 100,
    commentsPerFollowers: Math.round((comments / followers) * 30000 * 100) / 100,
    sharesPerFollowers: Math.round((shares / followers) * 50000 * 100) / 100,
  }

  let result = {}
  fields.forEach((field) => {
    result[field] = Scores[field]
  })

  return result
}

export { countPostStatistic }
