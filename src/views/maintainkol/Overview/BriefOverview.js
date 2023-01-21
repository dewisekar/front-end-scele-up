import React, { useState, useEffect, Suspense } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CAlert, CSpinner } from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { MDBDataTable } from 'mdbreact'

import { getRequestByUri } from '../../../utils/request-marketing'
import { LoadingAnimation } from 'src/components'
import { URL, OverviewParams } from 'src/constants'
import { roundScore } from 'src/utils/postUtil'
const tableField = [
  {
    field: 'yearMonth',
    label: 'Bulan - Tahun',
  },
  {
    field: 'numberOfPost',
    label: 'Jumlah Post',
  },
  {
    field: 'totalViews',
    label: 'Total Views',
  },
  {
    field: 'avgViews',
    label: 'Rata-Rata Views',
  },
  {
    field: 'avgCpm',
    label: 'Rata-Rata CPM',
  },
]

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
  const [isContentLoading, setIsContentLoading] = useState(false)
  const [BriefList, setBriefList] = useState([])
  const [statisticData, setStatisticData] = useState([])

  const fetchViewDataHandler = async (value) => {
    console.log(value)
    setIsContentLoading(true)
    try {
      const url = URL.GET_OVERVIEW + 'params=' + OverviewParams.BRIEF + '&id=' + value.Id
      const { message: fetchedOverview } = await getRequestByUri(url)
      const mappedData = fetchedOverview.map((data) => {
        return { ...data, avgViews: roundScore(data.avgViews), avgCpm: roundScore(data.avgCpm) }
      })

      setStatisticData(mappedData)
      setIsContentLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const renderDatatable = (data) => {
    let dataInput = {
      columns: tableField,
      rows: data,
    }
    return <MDBDataTable striped bordered data={dataInput}></MDBDataTable>
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
                  onChange={(event, value) => fetchViewDataHandler(value)}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardBody>
                <CAlert color="info" className="text-center">
                  Data yang diambil dari statistik post pada H+7 tanggal upload
                </CAlert>
                {isContentLoading && (
                  <CRow className="text-center">
                    <CCol>
                      <CSpinner color="primary" />
                    </CCol>
                  </CRow>
                )}
                {!isContentLoading && statisticData !== [] && renderDatatable(statisticData)}
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
