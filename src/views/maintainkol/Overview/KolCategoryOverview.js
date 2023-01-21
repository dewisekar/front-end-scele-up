import React, { useState, useEffect, Suspense } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CAlert, CSpinner } from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import 'react-datepicker/dist/react-datepicker.css'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { MDBDataTable } from 'mdbreact'

import { getRequestByUri, execSPWithoutInput } from '../../../utils/request-marketing'
import { LoadingAnimation } from 'src/components'
import { URL, OverviewParams, OverviewTableField, StoredProcedure } from 'src/constants'
import { roundScore } from 'src/utils/postUtil'

const KolCategoryOverview = () => {
  useEffect(() => {
    const fetchData = async () => {
      const { message: fetchedKolCategory } = await execSPWithoutInput(
        StoredProcedure.GET_KOL_CATEGORY,
      )
      const mappedData = fetchedKolCategory.map((data) => {
        return { Id: data['id'], label: data['category'] }
      })
      setKolCategoryList(mappedData)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const [isLoading, setIsLoading] = useState(true)
  const [isContentLoading, setIsContentLoading] = useState(false)
  const [kolCategoryList, setKolCategoryList] = useState([])
  const [statisticData, setStatisticData] = useState([])
  const [chartLineLabel, setChartLineLabel] = useState([])
  const [avgViews, setAvgViews] = useState([])
  const [avgCpm, setAvgCpm] = useState([])

  const fetchViewDataHandler = async (value) => {
    setIsContentLoading(true)
    try {
      const url = URL.GET_OVERVIEW + 'params=' + OverviewParams.KOL_CATEGORY + '&id=' + value.Id
      const { message: fetchedOverview } = await getRequestByUri(url)
      const views = []
      const cpm = []
      const label = []
      const mappedData = fetchedOverview.map((data) => {
        views.push(data.avgViews)
        cpm.push(data.avgCpm)
        label.push(data.yearMonth)
        return { ...data, avgViews: roundScore(data.avgViews), avgCpm: roundScore(data.avgCpm) }
      })
      setStatisticData(mappedData)
      setIsContentLoading(false)
      setAvgViews(views)
      setAvgCpm(cpm)
      setChartLineLabel(label)
    } catch (error) {
      console.log(error)
    }
  }

  const renderDatatable = (data) => {
    let dataInput = {
      columns: OverviewTableField,
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
                <strong>Kategori KOL Overview</strong>
              </CCardHeader>
              <CCardBody>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={kolCategoryList}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Choose Kategori KOL" size="small" />
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
        {statisticData.length !== 0 && (
          <CRow>
            <CCol xs={6}>
              <CCard className="mb-4">
                <CCardBody>
                  <CChartLine
                    data={{
                      labels: chartLineLabel,
                      datasets: [
                        {
                          label: 'Average Views',
                          backgroundColor: 'rgba(220, 220, 220, 0.2)',
                          borderColor: 'rgba(220, 220, 220, 1)',
                          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                          pointBorderColor: '#fff',
                          data: avgViews,
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={6}>
              <CCard className="mb-4">
                <CCardBody>
                  <CChartLine
                    data={{
                      labels: chartLineLabel,
                      datasets: [
                        {
                          label: 'Average CPM',
                          backgroundColor: 'rgba(220, 220, 220, 0.2)',
                          borderColor: 'rgba(220, 220, 220, 1)',
                          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                          pointBorderColor: '#fff',
                          data: avgCpm,
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        )}
      </Suspense>
    )
  }
  return <>{isLoading ? renderLoadingAnimation() : renderContent()}</>
}

export default KolCategoryOverview
