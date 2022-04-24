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

export default authenticateUsername
