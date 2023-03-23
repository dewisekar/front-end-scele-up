import React, { useState, useEffect, Suspense } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CAlert, CSpinner, CBadge } from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import 'react-datepicker/dist/react-datepicker.css'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { MDBDataTable } from 'mdbreact'
import Select from 'react-select'

import {
  getRequestByUri,
  execSPWithoutInput,
  getALLKolName,
} from '../../../utils/request-marketing'
import { LoadingAnimation } from 'src/components'
import { URL, OverviewParams, OverviewTableField, StoredProcedure } from 'src/constants'
import { roundScore } from 'src/utils/postUtil'
import { NumberFormat, RupiahCurrency } from 'src/components'

const KolOverview = () => {
  useEffect(() => {
    const fetchData = async () => {
      const { message: fetchedKol = [] } = await getALLKolName()
      const convertedKol = fetchedKol.map((data) => {
        return { value: data.ID, label: data.label, platform: data.platform }
      })
      const { message: fetchedOverview } = await getRequestByUri(URL.GET_POST_AND_COST_OVERVIEW)
      setPostCostOverview(fetchedOverview)
      setKolList(convertedKol)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const [isLoading, setIsLoading] = useState(true)
  const [isContentLoading, setIsContentLoading] = useState(false)
  const [kolList, setKolList] = useState([])
  const [statisticData, setStatisticData] = useState([])
  const [chartLineLabel, setChartLineLabel] = useState([])
  const [avgViews, setAvgViews] = useState([])
  const [avgCpm, setAvgCpm] = useState([])
  const [postCostOverview, setPostCostOverview] = useState({})

  const fetchViewDataHandler = async (value) => {
    setIsContentLoading(true)
    try {
      const url = URL.GET_OVERVIEW + 'params=' + OverviewParams.KOL + '&id=' + value.value
      const { message: fetchedOverview } = await getRequestByUri(url)
      const views = []
      const cpm = []
      const label = []
      const mappedData = fetchedOverview.map((data) => {
        const { totalViews, avgViews: noAvgViews, totalCostPerSlot } = data
        views.push(noAvgViews)
        cpm.push(data.avgCpm)
        label.push(data.yearMonth)
        return {
          ...data,
          avgCpm: <RupiahCurrency balance={roundScore(data.avgCpm)} />,
          avgViews: <NumberFormat number={roundScore(data.avgViews)} />,
          totalCostPerSlot: <RupiahCurrency balance={roundScore(totalCostPerSlot)} />,
          totalViews: <NumberFormat number={totalViews} />,
        }
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
                <strong>KOL Overview</strong>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol lg={4}>
                    <Select
                      placeholder="Select KOL..."
                      styles={{ width: '100% !important' }}
                      options={kolList}
                      onChange={fetchViewDataHandler}
                      getOptionValue={(e) => e.label}
                      getOptionLabel={(e) => (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>{e.label}</span>
                          <CBadge color="info" shape="rounded-pill">
                            {e.platform}
                          </CBadge>
                        </div>
                      )}
                    />
                  </CCol>
                  <CCol lg={6}>
                    Total Budget - Cost:{' '}
                    <RupiahCurrency balance={postCostOverview.totalCostData.cost} /> | Slot:{' '}
                    {postCostOverview.totalCostData.slot} <br></br>
                    Uploaded Budget - Cost:{' '}
                    <RupiahCurrency balance={postCostOverview.spentCostData.cost} /> | Slot:{' '}
                    {postCostOverview.spentCostData.slot} <br></br>
                    Remaining Budget - Cost:{' '}
                    <RupiahCurrency balance={postCostOverview.remainingCostData.cost} /> | Slot:{' '}
                    {postCostOverview.remainingCostData.slot}
                  </CCol>
                </CRow>
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

export default KolOverview
