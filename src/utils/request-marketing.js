import axios from 'axios'
import configData from '../appconfig.json'

//const baseUrl = 'http://localhost:5000'
const baseUrl = configData.MW_SERVER_URL

const insertNewKOL = async (
  jenisEndorse,
  jenisPlatform,
  kategoriKOL,
  namaKOL,
  usernameKOL,
  NoWhatsapp,
  AlamatKOL,
  NorekKOL,
  user,
) => {
  let data = JSON.stringify({
    JenisEndorse: jenisEndorse,
    JenisPlatform: jenisPlatform,
    KategoriKOL: kategoriKOL,
    NamaKOL: namaKOL,
    UsernameKOL: usernameKOL,
    NoWhatsapp: NoWhatsapp,
    AlamatKOL: AlamatKOL,
    NorekKOL: NorekKOL,
    User: user,
  })
  try {
    const res = await axios.post(baseUrl + '/insertNewKOL', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

export { insertNewKOL }
