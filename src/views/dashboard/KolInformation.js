import React, { useEffect, useState } from 'react'
import { CCol, CRow, CWidgetStatsB, CSpinner, CCard } from '@coreui/react'

import { getRequestByUri } from 'src/utils/request-marketing'

const KolInformation = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [kolInfo, setKolInfo] = useState({})

  useEffect(() => {
    const init = async () => {
      try {
        const { message } = await getRequestByUri('/marketing/dashboard/kol-overview')
        setKolInfo(message)
      } catch (error) {
        console.log('Error:', error)
      }
      setIsLoading(false)
    }

    init()
  }, [])

  const renderSpinner = () => {
    return (
      <CCard className="px-5 py-3" style={{ alignItems: 'center', display: 'flex' }}>
        <CSpinner color="secondary" />
      </CCard>
    )
  }

  const { numberOfActiveKol, totalSlotLeft } = kolInfo

  return (
    <CRow className="mb-4">
      <CCol xs={6}>
        {isLoading ? (
          renderSpinner()
        ) : (
          <CWidgetStatsB
            progress={{ color: 'info', value: 100 }}
            text="Jumlah KOL yang memiliki kontrak aktif/belum memenuhi seluruh slot per tahun 2023"
            title="KOL Aktif"
            value={numberOfActiveKol}
          />
        )}
      </CCol>
      <CCol xs={6}>
        {isLoading ? (
          renderSpinner()
        ) : (
          <CWidgetStatsB
            progress={{ color: 'success', value: 100 }}
            text="Total slot kontrak yang belum terjadwalkan"
            title="Slot Tersedia"
            value={totalSlotLeft}
          />
        )}
      </CCol>
    </CRow>
  )
}

export default KolInformation
