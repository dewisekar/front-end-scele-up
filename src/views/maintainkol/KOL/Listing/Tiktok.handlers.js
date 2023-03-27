import { postRequestByUri } from '../../../../utils/request-marketing'
import { getRupiahString, getNumberFormat, getRealValuesForTable } from 'src/utils/pageUtil'

const handleGetKolCpm = async (payload, handlers) => {
  const { setIsAlertModalShown, setModalMessage } = handlers
  const { status, error } = await postRequestByUri('/tiktok/get-listing', payload)

  if (error === 404) {
    setModalMessage({
      title: 'Username Tidak Ditemukan!',
      message: 'Pastikan anda memasukkan username yang benar!',
    })
    setIsAlertModalShown(true)
  }

  return status
}

const convertData = (data) => {
  const convertedData = data.map((item) => {
    const {
      createdAt,
      costPerSlot,
      username,
      totalViews,
      avgCpm,
      avgViews,
      minCpm,
      minViews,
      maxCpm,
      maxViews,
      followers,
    } = item
    const realCreatedAt = new Date(createdAt)

    const realAttributes = {
      totalViews,
      avgCpm,
      minCpm,
      maxCpm,
      avgViews,
      minViews,
      maxViews,
      costPerSlot,
    }

    const realProps = getRealValuesForTable(realAttributes)

    return {
      ...item,
      createdAt: new Date(createdAt).toLocaleDateString('id-ID'),
      username,
      realCreatedAt,
      costPerSlot: getRupiahString(costPerSlot),
      totalViews: getNumberFormat(totalViews),
      minCpm: getRupiahString(minCpm),
      maxCpm: getRupiahString(maxCpm),
      minViews: getNumberFormat(minViews),
      maxViews: getNumberFormat(maxViews),
      followers: getNumberFormat(followers),
      avgCpm: getRupiahString(avgCpm),
      ...realProps,
    }
  })

  return convertedData
}

export { handleGetKolCpm, convertData }
