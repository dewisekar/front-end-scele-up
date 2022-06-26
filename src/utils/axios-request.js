import axios from 'axios'
import configData from '../appconfig.json'

//const baseUrl = 'http://localhost:5000'
const baseUrl = configData.MW_SERVER_URL

const authenticateUsername = async (username, company, password) => {
  let data = JSON.stringify({
    Password: password,
    Username: username,
    Company: company,
  })
  try {
    const res = await axios.post(baseUrl + '/authenticateLogin', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const checkDailyFile = async (filename, channel, ismarketplace) => {
  let data = JSON.stringify({
    Filename: filename,
    Channel: channel,
    IsMarketplace: ismarketplace,
  })
  try {
    const res = await axios.post(baseUrl + '/isExistDailyFile', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const isExistFileResi = async (filename, channel, ismarketplace) => {
  let data = JSON.stringify({
    Filename: filename,
    Channel: channel,
    IsMarketplace: ismarketplace,
  })
  try {
    const res = await axios.post(baseUrl + '/isExistFileResi', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const insertDailyFile = async (filename, channel, ismarketplace, uploaddate) => {
  let data = JSON.stringify({
    Filename: filename,
    Channel: channel,
    IsMarketplace: ismarketplace,
    Date: uploaddate,
  })
  try {
    const res = await axios.post(baseUrl + '/insertDailyFile', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const insertDailyFileResi = async (filename, channel, ismarketplace, uploaddate) => {
  let data = JSON.stringify({
    Filename: filename,
    Channel: channel,
    IsMarketplace: ismarketplace,
    Date: uploaddate,
  })
  try {
    const res = await axios.post(baseUrl + '/insertDailyFileResi', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const getDailyFile = async (uploaddate) => {
  let data = JSON.stringify({
    Date: uploaddate,
  })
  try {
    const res = await axios.post(baseUrl + '/getDailyFile', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const getFileResi = async (startDate, endDate) => {
  let data = JSON.stringify({
    StartDate: startDate,
    EndDate: endDate,
  })
  try {
    const res = await axios.post(baseUrl + '/getFileResi', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const getJournalJualByDate = async (uploaddate) => {
  let data = JSON.stringify({
    Date: uploaddate,
  })
  try {
    const res = await axios.post(baseUrl + '/getJournalJualByDate', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const getTop100JournalJualToday = async () => {
  // let data = JSON.stringify({
  //   Date: uploaddate,
  // })
  try {
    const res = await axios.get(baseUrl + '/GetTop100JournalJualToday', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const getFormatJournalJual = async () => {
  // let data = JSON.stringify({
  //   Date: uploaddate,
  // })
  try {
    const res = await axios.get(baseUrl + '/getFormatJournalJual', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const uploadFile = async (formData) => {
  try {
    const res = await axios.post(baseUrl + '/uploadFile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return res.data
  } catch (err) {
    console.log(err)
  }
}

const handleDownloadTemplate = async () => {
  try {
    const res = await axios.get(baseUrl + '/downloadTenplate', {
      responseType: 'blob',
    })

    return res.data
  } catch (err) {
    console.log(err)
  }
  // axios
  //   .get(url, {
  //     responseType: 'blob',
  //   })
  //   .then((res) => {
  //     fileDownload(res.data, filename)
  //   })
}

const checkAndUpdateResiForScan = async (invoice, action) => {
  let data = JSON.stringify({
    Invoice: invoice,
    Action: action,
    Date: new Date(),
  })
  try {
    const res = await axios.post(baseUrl + '/CheckAndUpdateResiForScan', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const getKontrolPengirimanByDate = async (orderDate, processDate, action) => {
  let data = JSON.stringify({
    OrderDate: orderDate,
    ProcessDate: processDate,
    Action: action,
  })
  try {
    const res = await axios.post(baseUrl + '/getKontrolPengirimanByDate', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const getFormatTableGeneral = async (action) => {
  let data = JSON.stringify({
    Action: action,
  })
  try {
    const res = await axios.post(baseUrl + '/getFormatTableGeneral', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}
export {
  authenticateUsername,
  checkDailyFile,
  uploadFile,
  insertDailyFile,
  getDailyFile,
  getFileResi,
  getTop100JournalJualToday,
  getJournalJualByDate,
  getFormatJournalJual,
  handleDownloadTemplate,
  checkAndUpdateResiForScan,
  getKontrolPengirimanByDate,
  getFormatTableGeneral,
  isExistFileResi,
  insertDailyFileResi,
}

// export default authenticateUsername
