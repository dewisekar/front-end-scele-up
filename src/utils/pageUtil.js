const getPostStatus = (deadlinePost, uploadDate) => {
  const today = new Date()
  const convertedDeadline = deadlinePost.setHours(0, 0, 0, 0)
  const convertedToday = today.setHours(0, 0, 0, 0)

  if (uploadDate === null && convertedToday <= convertedDeadline) {
    return 'ONSCHEDULE'
  }
  if (uploadDate === null && convertedToday > convertedDeadline) {
    return 'MISSED'
  }
  return 'FULFILLED'
}

const convertDate = (date, mode = 'DDMMYYYY') => {
  const convertedDate = new Date(date)

  const deadlineDay = ('0' + convertedDate.getDate()).slice(-2)
  const deadlineMonth = ('0' + (convertedDate.getMonth() + 1)).slice(-2)
  const deadlineYear = convertedDate.getFullYear()

  const DateModes = {
    DDMMYYYY: `${deadlineDay}-${deadlineMonth}-${deadlineYear}`,
    YYYYMMDD: `${deadlineYear}-${deadlineMonth}-${deadlineDay}`,
  }

  return DateModes[mode]
}

export { getPostStatus, convertDate }
