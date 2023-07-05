import React, { useState, useEffect } from 'react'

import { CCol, CRow, CCardBody, CCard, CWidgetStatsB, CAlert } from '@coreui/react'
import { CChartBar } from '@coreui/react-chartjs'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Select from 'react-select'
import DataTable from 'react-data-table-component'

import { getRequestByUri } from 'src/utils/request-marketing'
import CardSpinner from './CardSpinner'
import { URL } from 'src/constants'
import { tableColumns, BadgeEnum, customSort } from './MonthlySlotUsage.config'
import { StatusBadge } from 'src/components'

const MonthlySlotUsage = () => {
  const allOption = { value: 'ALL', label: 'Semua PIC' }
  const [managerList, setManagerList] = useState([])
  const [post, setPost] = useState([])
  const [year, setYear] = useState(new Date())
  const [monthlyOverview, setMonthlyOverview] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isScheduleLoading, setIsScheduleLoading] = useState(true)
  const [data, setData] = useState({})
  const today = new Date()
  const [chosenPic, setChosenPic] = useState(allOption)
  const dateOptions = { year: 'numeric', month: 'long' }
  const nowMonthYear = today.toLocaleDateString('id-ID', dateOptions)

  useEffect(() => {
    const init = async () => {
      setIsScheduleLoading(true)

      try {
        const { message: fetchedManager = [] } = await getRequestByUri(URL.GET_MANAGER_LIST)
        const mappedManager = fetchedManager.map((data) => {
          return { value: data['Manager Id'], label: data['Manager Name'] }
        })
        const managerId = chosenPic.value
        const { message: fetchedPost = [] } = await getRequestByUri(
          '/marketing/dashboard/post-reminder?managerId=' + managerId,
        )
        const mappedPost = fetchedPost.map((item) => {
          const { deadlinePost, status } = item

          return {
            ...item,
            status: <StatusBadge enumType={BadgeEnum} content={status} />,
            realStatus: status,
            realDeadlinePost: new Date(deadlinePost),
            deadlinePost: new Date(deadlinePost).toLocaleDateString('id-ID'),
          }
        })

        setPost(mappedPost)
        setManagerList([allOption, ...mappedManager])
      } catch (error) {
        console.log('Error:', error)
      }
      setIsScheduleLoading(false)
    }

    init()
  }, [chosenPic])

  useEffect(() => {
    const init = async () => {
      const yearOnly = year.getFullYear()
      const monthOnly = today.getMonth() + 1
      const yearOnlyForMonthly = today.getFullYear()
      setIsLoading(true)

      try {
        const { message: slotUsage } = await getRequestByUri(
          '/marketing/dashboard/slot-usage/' + yearOnly,
        )
        const { message } = await getRequestByUri(
          '/marketing/dashboard/monthly-post-usage/year/' +
            yearOnlyForMonthly +
            '/month/' +
            monthOnly,
        )

        setData(slotUsage)
        setMonthlyOverview(message)
      } catch (error) {
        console.log('Error:', error)
      }
      setIsLoading(false)
    }

    init()
  }, [year])

  const renderReminder = () => (
    <CWidgetStatsB
      progress={{ color: 'primary', value: 100 }}
      title="Jadwal Perlu Followup"
      value={monthlyOverview.numberPostToBeFollowedUp.totalPost}
    />
  )

  const renderThisMonthsPost = () => (
    <CWidgetStatsB
      progress={{ color: 'success', value: 100 }}
      text={nowMonthYear}
      title="Jumlah Post Bulan Ini"
      value={monthlyOverview.numberOfPost.totalPost}
    />
  )

  const renderChart = () => (
    <CChartBar
      data={{
        labels: data.monthLabel,
        datasets: [
          {
            label: 'Slot Tersedia',
            backgroundColor: '#f87979',
            data: data.planned,
          },
          {
            label: 'Slot Terpakai',
            backgroundColor: '#f89012',
            data: data.used,
          },
        ],
      }}
      labels="months"
      options={{
        plugins: {
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return (
                  tooltipItem.dataset.label +
                  ': ' +
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  }).format(tooltipItem.raw)
                )
              },
            },
          },
        },
      }}
    />
  )

  return (
    <CRow>
      <CCol xs={6}>
        {isLoading ? (
          <CardSpinner />
        ) : (
          <CCard>
            <CCardBody>
              <CRow className="mb-1">
                <CCol className="text-center" xs={12}>
                  <h6 className="font-weight-bold mb-0">Report Pemakaian Slot</h6>
                </CCol>
              </CRow>
              <CRow className="mb-4">
                <CCol xs={12}>
                  <small className="font-weight-bold">Pilih Tahun:</small>
                  <DatePicker
                    selected={year}
                    onChange={(date) => setYear(date)}
                    showYearPicker
                    dateFormat="yyyy"
                    className="w-100"
                  />
                </CCol>
              </CRow>
              <CRow>{renderChart()}</CRow>
              <CRow className="mt-4">
                <CCol xs={6}>{renderReminder()}</CCol>
                <CCol xs={6}>{renderThisMonthsPost()}</CCol>
              </CRow>
            </CCardBody>
          </CCard>
        )}
      </CCol>
      <CCol xs={6}>
        {isScheduleLoading ? (
          <CardSpinner />
        ) : (
          <CCard>
            <CCardBody>
              <CRow className="mb-1">
                <CCol className="" xs={12}>
                  <h6 className="font-weight-bold text-center">Jadwal Perlu Follow Up</h6>
                  <CAlert color="info" className="pt-1 pb-1" style={{ fontSize: '11px' }}>
                    KOL sudah menerima reminder otomatis pada H-3 dan H-1 jadwal post. Atau anda
                    bisa mengirim ulang reminder dengan tombol di bawah (SOON).
                  </CAlert>
                </CCol>
              </CRow>
              <CRow className="mb-4">
                <CCol xs={12}>
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
              <CRow className="dashboard-datatable">
                <DataTable
                  columns={tableColumns}
                  data={post}
                  pagination
                  paginationRowsPerPageOptions={[10, 25, 50, 100]}
                  sortFunction={customSort}
                  // paginationResetDefaultPage={resetPaginationToggle}
                  dense
                />
              </CRow>
            </CCardBody>
          </CCard>
        )}
      </CCol>
    </CRow>
  )
}

export default MonthlySlotUsage
