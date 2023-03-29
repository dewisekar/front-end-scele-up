import React, { useState, useEffect } from 'react'

import { CCol, CRow, CCardBody, CCard } from '@coreui/react'
import { CChartBar } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilDescription } from '@coreui/icons'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { getRequestByUri } from 'src/utils/request-marketing'
import CardSpinner from './CardSpinner'

const MonthlySlotUsage = () => {
  const [year, setYear] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({})

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      const yearOnly = year.getFullYear()

      try {
        const { message } = await getRequestByUri('/marketing/dashboard/slot-usage/' + yearOnly)
        setData(message)
      } catch (error) {
        console.log('Error:', error)
      }
      setIsLoading(false)
    }

    init()
  }, [year])

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
            </CCardBody>
          </CCard>
        )}
      </CCol>
    </CRow>
  )
}

export default MonthlySlotUsage
