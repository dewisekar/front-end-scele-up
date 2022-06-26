const dateDiffInDays = (d2, d1) => {
  var t2 = d2.getTime()
  var t1 = d1.getTime()
  return Math.floor((t2 - t1) / (1000 * 60 * 60 * 24))
}

export { dateDiffInDays }
