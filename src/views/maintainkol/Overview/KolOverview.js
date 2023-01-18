import React, { useState, useEffect, Suspense } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormSelect } from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

import { getALLKolName } from '../../../utils/request-marketing'
import { LoadingAnimation } from 'src/components'

const KolOverview = () => {
  useEffect(() => {
    const fetchData = async () => {
      const { message: fetchedKol } = await getALLKolName()
      console.log(fetchedKol)
      setListKolName(fetchedKol)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const [isLoading, setIsLoading] = useState(true)
  const [listKolName, setListKolName] = useState([])

  const inputNameHandler = (value) => {
    console.log('ini kolid', value)
  }

  const renderLoadingAnimation = () => {
    return <LoadingAnimation />
  }

  const renderContent = () => {
    return (
      <Suspense>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>KOL Overview</strong>
              </CCardHeader>
              <CCardBody>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={listKolName}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Choose KOL" size="small" />
                  )}
                  onChange={(event, value) => inputNameHandler(value)}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </Suspense>
    )
  }
  return <>{isLoading ? renderLoadingAnimation() : renderContent()}</>
}

export default KolOverview
