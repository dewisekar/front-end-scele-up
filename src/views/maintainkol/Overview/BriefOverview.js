import React, { useState, useEffect, Suspense } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormSelect } from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

import { getRequestByUri } from '../../../utils/request-marketing'
import { LoadingAnimation } from 'src/components'
import { URL } from 'src/constants'

const BriefOverview = () => {
  useEffect(() => {
    const fetchData = async () => {
      const { message: fetchedBrief } = await getRequestByUri(URL.GET_BRIEF_LIST)
      const mappedData = fetchedBrief.map((data) => {
        return { Id: data['Brief Id'], label: data['Brief Code Tema'] }
      })
      setBriefList(mappedData)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const [isLoading, setIsLoading] = useState(true)
  const [BriefList, setBriefList] = useState([])

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
                <strong>Brief Overview</strong>
              </CCardHeader>
              <CCardBody>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={BriefList}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Choose Brief" size="small" />
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

export default BriefOverview
