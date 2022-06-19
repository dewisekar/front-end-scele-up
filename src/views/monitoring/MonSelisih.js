import React, { useState, useEffect } from 'react'
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

import { getKontrolPengirimanByDate, getFormatTableGeneral } from '../../utils/axios-request'
import { format } from 'date-fns'
import { MDBDataTable } from 'mdbreact'
import DatePicker from 'react-datepicker'
const MonSelisih = () => {
  useEffect(() => {
    let resgetFormatTableGeneral = getFormatTableGeneral('KONTROLPENGIRIMAN')
    try {
      resgetFormatTableGeneral.then(function (result) {
        console.log('resgetFormatTableGeneral:', result.status)
        if (result.status === 'true') {
          setFormatTable(result.message)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }, [])

  const handleOnSubmit = () => {
    try {
      let res = getKontrolPengirimanByDate(fileDate, jenisData)
      res.then(function (result) {
        console.log(result)
        if (result.status === 'true') {
          setHideTable(false)
          setDataTable(result.message)
          setIsErrorMessage(0)
          setErrorMessage('')
        } else {
          setHideTable(true)
          setDataTable(null)
          setIsErrorMessage(1)
          setErrorMessage('Data tidak ditemukan')
        }
      })
    } catch (err) {
      console.log(err)
      setIsErrorMessage(1)
      setErrorMessage('Data tidak ditemukan')
    }
  }

  const TextErrorMessage = (props) => {
    return (
      <div className={props.IsError == 1 ? 'text-danger' : 'text-primary'}>
        <h6>{props.IsError == 1 ? props.Message : ''}</h6>
      </div>
    )
  }

  const DatatablePage = (props) => {
    if (formatTable != null) {
      let dataInput = {
        columns: formatTable,
        rows: props.data,
      }
      return <MDBDataTable scrollX striped bordered data={dataInput} />
    } else {
      return (
        <div className="text-danger">
          <h6>Can not find format</h6>
        </div>
      )
    }
  }

  //state
  const [fileDate, setFileDate] = useState(new Date())
  const [jenisData, setjenisData] = useState('ALL')
  const [hideTable, setHideTable] = useState(true)
  const [dataTable, setDataTable] = useState(null)
  const [isErrorMessage, setIsErrorMessage] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [formatTable, setFormatTable] = useState(null)

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
            value={jenisData}
            onChange={(e) => {
              setjenisData(e.target.value)
            }}
          >
            <option value="ALL">Seluruh Data</option>
            <option value="PRINTANDSEND">Data yang sudah diprint dan dikirim</option>
            <option value="PRINT">Data yang sudah diprint namun belum dikirim</option>
            <option value="NOTYET">Data yang belum diprint dan belum dikirim</option>
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
          {isErrorMessage > 0 && (
            <TextErrorMessage IsError={isErrorMessage} Message={errorMessage} />
          )}
        </CCardBody>
      </CCard>
      {!hideTable && (
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Kontrol Pengiriman Tanggal {format(fileDate, 'dd-MM-yyyy')}</strong>{' '}
          </CCardHeader>
          <CCardBody>
            <DatatablePage data={dataTable} />
          </CCardBody>
        </CCard>
      )}
    </div>
  )
}

export default MonSelisih
