import axios from 'axios'
import configData from '../appconfig.json'

const baseUrl = 'http://localhost:5002'
// const baseUrl = configData.MW_SERVER_URL
const pythonUrl = configData.PYTHON_SERVER_URL
const getRequestByUri = async (endpoint) => {
  // let data = JSON.stringify({
  //   Date: uploaddate,
  // })
  try {
    const res = await axios.get(baseUrl + endpoint /*'/getFormatListKol'*/, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const insertNewKOL = async (
  jenisEndorse,
  jenisPlatform,
  kategoriKOL,
  namaKOL,
  usernameKOL,
  NoWhatsapp,
  AlamatKOL,
  NorekKOL,
  KTP,
  Bank,
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
    KTP: KTP,
    Bank: Bank,
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
const getFormatListKol = async () => {
  // let data = JSON.stringify({
  //   Date: uploaddate,
  // })
  try {
    const res = await axios.get(baseUrl + '/getFormatListKol', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}
const getListKol = async () => {
  // let data = JSON.stringify({
  //   Date: uploaddate,
  // })
  try {
    const res = await axios.get(baseUrl + '/getListKol', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const getALLKolName = async () => {
  // let data = JSON.stringify({
  //   Date: uploaddate,
  // })
  try {
    const res = await axios.get(baseUrl + '/getALLKolName', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const getKolDetailById = async (Id) => {
  // let data = JSON.stringify({
  //   Date: uploaddate,
  // })
  try {
    const res = await axios.get(baseUrl + '/getKolDetail?Id=' + Id.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const getSubMediaById = async (Id) => {
  // let data = JSON.stringify({
  //   Date: uploaddate,
  // })
  try {
    const res = await axios.get(baseUrl + '/getSubMediaById?Id=' + Id.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const insertNewKontrak = async (
  id,
  subMedia,
  bookingSlot,
  biayaKerjaSama,
  DP,
  manager,
  // fileMou,
  tanggalAwalKerjaSama,
  tanggalAkhirKerjaSama,
  user,
) => {
  let data = JSON.stringify({
    Id: id,
    SubMedia: subMedia,
    BookingSlot: bookingSlot,
    BiayaKerjaSama: biayaKerjaSama,
    DP: DP,
    Manager: manager,
    // FileMou: fileMou,
    TanggalAwalKerjaSama: tanggalAwalKerjaSama,
    TanggalAkhirKerjaSama: tanggalAkhirKerjaSama,
    User: user,
  })
  try {
    const res = await axios.post(baseUrl + '/insertNewKontrak', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const insertNewBrief = async (tema, konsep, script, refLink, managerId, user) => {
  let data = JSON.stringify({
    Tema: tema,
    Konsep: konsep,
    Script: script,
    RefLink: refLink,
    ManagerId: managerId,
    User: user,
  })
  try {
    const res = await axios.post(baseUrl + '/insertNewBrief', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const insertNewManager = async (managerName, noWhatsApp, email, alias, Roles, NoKTP, user) => {
  let data = JSON.stringify({
    ManagerName: managerName,
    NoWhatsApp: noWhatsApp,
    Email: email,
    Alias: alias,
    Roles: Roles,
    NoKTP: NoKTP,
    User: user,
  })
  try {
    const res = await axios.post(baseUrl + '/insertNewManager', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const insertNewPost = async (payload) => {
  let data = JSON.stringify(payload)
  try {
    const res = await axios.post(baseUrl + '/insertNewPost', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const getFormatList = async (menu) => {
  // let data = JSON.stringify({
  //   Date: uploaddate,
  // })
  try {
    const res = await axios.get(baseUrl + '/getFormatList?menu=' + menu, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const getVideoAndUserStats = async (linkPost) => {
  let data = JSON.stringify({
    video_url: linkPost,
  })
  try {
    const res = await axios.post(pythonUrl + '/getTiktokVideoWithUserStats/', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const execSPWithoutInput = async (SPName) => {
  let data = JSON.stringify({
    SPName: SPName,
  })
  try {
    const res = await axios.post(baseUrl + '/execSPWithoutInput/', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const execSPWithInput = async (SPName, Input) => {
  let data = JSON.stringify({
    SPName: SPName,
    Input: Input,
  })
  try {
    const res = await axios.post(baseUrl + '/execSPWithInput/', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  } catch (err) {
    console.error(err)
  }
}

const updatePostStatsById = async (Id) => {
  let data = JSON.stringify({
    Id: Id,
  })
  try {
    const res = await axios.post(baseUrl + '/updatePostStatsById/', data, {
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
  insertNewKOL,
  getFormatListKol,
  getListKol,
  getALLKolName,
  getKolDetailById,
  getSubMediaById,
  insertNewKontrak,
  getRequestByUri,
  insertNewBrief,
  insertNewManager,
  getFormatList,
  insertNewPost,
  getVideoAndUserStats,
  execSPWithoutInput,
  execSPWithInput,
  updatePostStatsById,
}
