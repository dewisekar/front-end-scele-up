import React, { useState } from 'react'

import { CCol, CRow, CCardBody, CCard } from '@coreui/react'
import { CChartBar } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilDescription } from '@coreui/icons'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { setDate } from 'date-fns'

const activeKolMessage = 'KOL Aktif (Memiliki Slot)'

const MonthlySlotUsage = () => {
  const [year, setYear] = useState(new Date())
  console.log(year)

  return (
    <CRow>
      <CCol xs={6}>
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
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                ],
                datasets: [
                  {
                    label: 'GitHub Commits',
                    backgroundColor: '#f87979',
                    data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 40, 20, 12, 39, 10],
                  },
                  {
                    label: 'GitHub',
                    backgroundColor: '#f89012',
                    data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
                  },
                ],
              }}
              labels="months"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default MonthlySlotUsage
