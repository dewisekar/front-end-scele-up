import React, { useState, useEffect } from 'react'

import { CCol, CRow, CCardBody, CCard, CWidgetStatsB } from '@coreui/react'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Select from 'react-select'

import { getRequestByUri } from 'src/utils/request-marketing'
import CardSpinner from './CardSpinner'
import { URL } from 'src/constants'

const ViewsByCategory = () => {
  const allOption = { value: 'ALL', label: 'Semua PIC' }
  const [year, setYear] = useState(new Date())
  const [chosenPic, setChosenPic] = useState(allOption)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({})
  const [managerList, setManagerList] = useState([])

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      const managerId = chosenPic.value

      try {
        const urlParams = `?managerId=${managerId}`
        const { message: totalViews } = await getRequestByUri(
          '/marketing/dashboard/views-per-category' + urlParams,
        )
        const { message: fetchedManager = [] } = await getRequestByUri(URL.GET_MANAGER_LIST)
        const mappedManager = fetchedManager.map((data) => {
          return { value: data['Manager Id'], label: data['Manager Name'] }
        })
        console.log(totalViews)

        setData(totalViews)
        setManagerList([allOption, ...mappedManager])
      } catch (error) {
        console.log('Error:', error)
      }
      setIsLoading(false)
    }

    init()
  }, [year, chosenPic])

  const renderViewsChart = () => (
    <CChartBar
      data={{
        labels: data.label,
        datasets: [
          {
            label: 'Total Views',
            backgroundColor: '#8e79f8',
            data: data.totalViews,
          },
        ],
      }}
      options={{ indexAxis: 'y' }}
    />
  )

  const renderUsageChart = () => (
    <CChartBar
      data={{
        labels: data.label,
        datasets: [
          {
            label: 'Total Penggunaan',
            backgroundColor: '#f879b0',
            data: data.totalUsage,
          },
        ],
      }}
      options={{ indexAxis: 'y' }}
    />
  )

  return (
    <CRow className="mt-4">
      <CCol xs={12}>
        {isLoading ? (
          <CardSpinner />
        ) : (
          <CCard>
            <CCardBody>
              <CRow className="mb-1"></CRow>
              <CRow className="mb-4">
                <CCol xs={6}>
                  <small className="font-weight-bold">Pilih PIC:</small>
                  <Select
                    placeholder="Select Manager..."
                    styles={{ width: '100% !important' }}
                    options={managerList}
                    defaultValue={allOption}
                    onChange={(event) => setChosenPic(event)}
                    value={chosenPic}
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={6}>{renderViewsChart()}</CCol>
                <CCol xs={6}>{renderUsageChart()}</CCol>
              </CRow>
            </CCardBody>
          </CCard>
        )}
      </CCol>
    </CRow>
  )
}

export default ViewsByCategory
