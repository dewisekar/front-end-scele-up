import React, { useState, useEffect } from 'react'

import { CCol, CRow, CCardBody, CCard, CWidgetStatsB } from '@coreui/react'
import { CChartBar } from '@coreui/react-chartjs'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { getRequestByUri } from 'src/utils/request-marketing'
import CardSpinner from './CardSpinner'

const MonthlySlotUsage = () => {
  const [year, setYear] = useState(new Date())
  const [monthlyOverview, setMonthlyOverview] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({})
  const today = new Date()
  const dateOptions = { year: 'numeric', month: 'long' }
  const nowMonthYear = today.toLocaleDateString('id-ID', dateOptions)

  useEffect(() => {
    const init = async () => {
      const yearOnly = year.getFullYear()
      const monthOnly = today.getMonth() + 1
      setIsLoading(true)

      try {
        const { message: slotUsage } = await getRequestByUri(
          '/marketing/dashboard/slot-usage/' + yearOnly,
        )
        const { message } = await getRequestByUri(
          '/marketing/dashboard/monthly-post-usage/year/' + yearOnly + '/month/' + monthOnly,
        )
        console.log(message)
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
    </CRow>
  )
}

export default MonthlySlotUsage
