import React, { useState, useEffect } from 'react'

import { CCol, CRow, CCardBody, CCard, CWidgetStatsB } from '@coreui/react'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Select from 'react-select'

import { getRequestByUri } from 'src/utils/request-marketing'
import CardSpinner from './CardSpinner'
import { URL } from 'src/constants'

const TotalViewOverview = () => {
  const allOption = { value: 'ALL', label: 'Semua PIC' }
  const [year, setYear] = useState(new Date())
  const [chosenPic, setChosenPic] = useState(allOption)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({})
  const [managerList, setManagerList] = useState([])
  const today = new Date()

  useEffect(() => {
    const init = async () => {
      const yearOnly = year.getFullYear()
      setIsLoading(true)
      const managerId = chosenPic.value

      try {
        const urlParams =
          managerId === 'ALL' ? `?year=${yearOnly}` : `?year=${yearOnly}&managerId=${managerId}`
        const { message: totalViews } = await getRequestByUri(
          '/marketing/dashboard/total-views' + urlParams,
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

  const renderChart = () => (
    <CChartLine
      data={{
        labels: data.month,
        datasets: [
          {
            label: 'Total Views: ' + chosenPic.label,
            backgroundColor: '#79d4f8',
            borderColor: '#79d4f8',
            pointBackgroundColor: '#79d4f8',
            pointBorderColor: '#79d4f8',
            data: data.totalViews,
          },
        ],
      }}
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
              <CRow className="mb-1">
                <CCol className="text-center" xs={12}>
                  <h6 className="font-weight-bold mb-0">Report Performance Matrix</h6>
                </CCol>
              </CRow>
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
                <CCol xs={6}>
                  <small className="font-weight-bold">Pilih Tahun:</small>
                  <DatePicker
                    selected={year}
                    onChange={(date) => setYear(date)}
                    showYearPicker
                    dateFormat="yyyy"
                    className="w-100 big"
                  />
                </CCol>
              </CRow>
              <CRow>{renderChart()}</CRow>
            </CCardBody>
          </CCard>
        )}
      </CCol>
    </CRow>
  )
}

export default TotalViewOverview
