import React, { useState, useEffect } from 'react'

import { CCol, CRow, CCardBody, CCard, CWidgetStatsB, CFormInput, CButton } from '@coreui/react'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Select from 'react-select'

import { getRequestByUri } from 'src/utils/request-marketing'
import CardSpinner from './CardSpinner'
import { URL } from 'src/constants'

const ViewsByCategory = () => {
  const allOption = { value: 'ALL', label: 'Semua PIC' }
  const [chosenPic, setChosenPic] = useState(allOption)
  const [isLoading, setIsLoading] = useState(true)
  const [isAll, setIsAll] = useState(true)
  const [data, setData] = useState({})
  const [managerList, setManagerList] = useState([])
  const [filterTime, setFilterTime] = useState({})
  const [time, setTime] = useState({ startDate: '', endDate: '' })
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      const managerId = chosenPic.value
      const startDate = time.startDate === '' ? 'ALL' : time.startDate
      const endDate = time.endDate === '' ? 'ALL' : time.endDate

      try {
        const urlParams = `?managerId=${managerId}&startDate=${startDate}&endDate=${endDate}`
        const { message: totalViews } = await getRequestByUri(
          '/marketing/dashboard/views-per-category' + urlParams,
        )
        const { message: fetchedManager = [] } = await getRequestByUri(URL.GET_MANAGER_LIST)
        const mappedManager = fetchedManager.map((data) => {
          return { value: data['Manager Id'], label: data['Manager Name'] }
        })

        setData(totalViews)
        setManagerList([allOption, ...mappedManager])
      } catch (error) {
        console.log('Error:', error)
      }
      setIsLoading(false)
    }

    init()
  }, [chosenPic, time])

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

  const onFormChange = (event) => {
    const { name, value, action, label } = event.target
    const newValue =
      action && value
        ? { value: typeof value === 'string' ? value.toLowerCase() : value, label }
        : value

    setFilterTime({ ...filterTime, [name]: newValue })
  }

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
                <CCol xs={6}>
                  <CRow>
                    <div className="col-md-5">
                      <small>Start Date</small>
                      <CFormInput
                        type="date"
                        name="startDate"
                        onChange={onFormChange}
                        value={filterTime.startDate}
                      />
                    </div>
                    <div className="col-md-5">
                      <small>End Date</small>
                      <CFormInput
                        type="date"
                        name="endDate"
                        onChange={onFormChange}
                        value={filterTime.endDate}
                      />
                    </div>
                    <div className="col-md-2">
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
