import { DateMode } from 'src/constants'

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

const convertDate = (date, mode = DateMode.DDMMYYYY) => {
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

const getRupiahString = (balance) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(balance)

const getNumberFormat = (number) => new Intl.NumberFormat('id-ID').format(number)

const getRealValuesForTable = (data) => {
  let result = {}
  const keys = Object.keys(data)

  keys.forEach((key) => {
    const lastKey = key.toString().substring(1, key.length)
    const newKey = 'real' + key[0].toUpperCase() + lastKey
    result[newKey] = data[key]
  })

  return result
}

const getCpmStatus = (cpm) => {
  if (cpm === 0) {
    return 'BLANK'
  }
  if (cpm < 5000) {
    return 'VERY_GOOD'
  }
  if (cpm >= 5001 && cpm <= 10000) {
    return 'GOOD'
  }
  if (cpm >= 10001 && cpm <= 25000) {
    return 'BAD'
  }
  return 'VERY_BAD'
}

export {
  getPostStatus,
  convertDate,
  getRupiahString,
  getNumberFormat,
  getRealValuesForTable,
  getCpmStatus,
}
