import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CFormSelect,
} from '@coreui/react'

import DatePicker from 'react-datepicker'
const MonSelisih = () => {
  const [fileDate, setFileDate] = useState(new Date())
  const [marketplace, setMarketPlace] = useState('default')

  const handleOnSubmit = () => {
    console.log('tes')
  }
  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Kontrol Pengiriman</strong> {/*<small>File input</small>*/}
        </CCardHeader>
        <CCardBody>
          <CFormLabel htmlFor="formFile">Pilih Tanggal</CFormLabel>
          <DatePicker
            className="mb-3 text-center"
            selected={fileDate}
            onChange={(date: Date) => setFileDate(date)}
          />
          <CFormLabel htmlFor="formFile">Pilih Jenis Data</CFormLabel>
          <CFormSelect
            className="mb-3"
            aria-label="Large select example"
            value={marketplace}
            onChange={(e) => {
              setMarketPlace(e.target.value)
            }}
          >
            <option value="ALL">Seluruh Data</option>
            <option value="PRINTANDSEND">Data yang sudah diprint dan dikirim</option>
            <option value="PRINT">Data yang sudah diprint namun belum dikirim</option>
            <option value="NOT YET">Data yang belum diprint dan belum dikirim</option>
          </CFormSelect>
          <CButton
            color="secondary"
            active={'active' === 'active'}
            variant="outline"
            key="1"
            onClick={handleOnSubmit}
          >
            Submit
          </CButton>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default MonSelisih
