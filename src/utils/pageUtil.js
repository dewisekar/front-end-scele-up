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

const convertDate = (date) => {
  const convertedDate = new Date(date)

  const deadlineDay = convertedDate.getDate()
  const deadlineMonth = convertedDate.getMonth() + 1
  const deadlineYear = convertedDate.getFullYear()

  return `${deadlineDay}-${deadlineMonth}-${deadlineYear}`
}

export { getPostStatus, convertDate }
