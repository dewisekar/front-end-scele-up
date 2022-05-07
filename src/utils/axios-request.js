import axios from 'axios'

const baseUrl = 'http://localhost:5000'

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

export { authenticateUsername, checkDailyFile, uploadFile, insertDailyFile }

// export default authenticateUsername
