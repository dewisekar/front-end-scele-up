import React, { useState, useEffect } from 'react'

import { CCol, CRow, CCardBody, CCard, CButton } from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Select from 'react-select'

import { getRequestByUri } from 'src/utils/request-marketing'
import CardSpinner from './CardSpinner'
import { URL } from 'src/constants'

const FypOverview = () => {
  const allOption = { value: 'ALL', label: 'Semua PIC' }
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const initialStart = new Date(`${currentYear}-01-01`)
  const initialEnd = currentDate
  const [chosenPic, setChosenPic] = useState(allOption)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({})
  const [managerList, setManagerList] = useState([])
  const [time, setTime] = useState({ startDate: initialStart, endDate: initialEnd })
  const [filterTime, setFilterTime] = useState({ startDate: initialStart, endDate: initialEnd })
  const [isAll, setIsAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)

      try {
        const { message: fetchedManager = [] } = await getRequestByUri(URL.GET_MANAGER_LIST)
        const mappedManager = fetchedManager.map((data) => {
          return { value: data['Manager Id'], label: data['Manager Name'] }
        })

        setManagerList([allOption, ...mappedManager])
      } catch (error) {
        console.log('Error:', error)
      }
      setIsLoading(false)
    }

    init()
  }, [])

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      const managerId = chosenPic.value
      const { startDate, endDate } = time

      try {
        const urlParams = `?managerId=${managerId}&startDate=${startDate}&endDate=${endDate}`
        const { message: totalViews } = await getRequestByUri(
          '/marketing/dashboard/fyp-overview' + urlParams,
        )

        setData(totalViews)
      } catch (error) {
        console.log('Error:', error)
      }
      setIsLoading(false)
    }

    init()
  }, [time, chosenPic])

  const onSetTime = () => {
    const { startDate = '', endDate = '' } = filterTime
    const convertedStartDate = new Date(startDate)
    const convertedEndDate = new Date(endDate)
    if (startDate === '' && endDate === '') {
      setIsAll(true)
      setTime({ startDate: '', endDate: '' })
      return
    }

    if ((startDate === '' && endDate !== '') || (startDate !== '' && endDate === '')) {
      setErrorMessage('Masukkan tanggal yang valid')
      return
    }

    if (convertedEndDate < convertedStartDate) {
      setErrorMessage('Waktu mulai harus lebih dulu daripada waktu selesai')
      return
    }

    setTime(filterTime)
    setIsAll(false)
    setIsAll(filterTime.startDate === '' && filterTime.endDate === '')
    setErrorMessage(null)
  }

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
                  <h6 className="font-weight-bold mb-0">Report Performance Post KOL FYP</h6>
                </CCol>
              </CRow>
              <CRow className="mb-4">
                <CCol xs={4}>
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
                <CCol xs={8}>
                  <CRow>
                    <div className="col-md-4">
                      <small>Start Date</small>
                      <DatePicker
                        selected={filterTime.startDate}
                        onChange={(date) => setFilterTime({ ...filterTime, startDate: date })}
                        showMonthYearPicker
                        dateFormat="MM/yyyy"
                        className="w-100 big"
                        name="startDate"
                      />
                    </div>
                    <div className="col-md-4">
                      <small>End Date</small>
                      <DatePicker
                        selected={filterTime.endDate}
                        onChange={(date) => setFilterTime({ ...filterTime, endDate: date })}
                        showMonthYearPicker
                        dateFormat="MM/yyyy"
                        className="w-100 big"
                        name="endDate"
                      />
                    </div>
                    <div className="col-md-4" style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <CButton className="btn btn-primary" onClick={onSetTime}>
                        Set Waktu
                      </CButton>
                    </div>
                  </CRow>
                  <CRow>
                    {isAll && <small>Periode: Semua Waktu</small>}
                    {errorMessage && <small className="text-danger">{errorMessage}</small>}
                  </CRow>
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

export default FypOverview
