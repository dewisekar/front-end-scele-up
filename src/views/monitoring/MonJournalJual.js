import React, { useEffect, useState, Suspense } from 'react'
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
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { DocsCallout, DocsExample } from 'src/components'
import { getJournalJualByDate, getFormatJournalJual } from '../../utils/axios-request'
import { format } from 'date-fns'
import { MDBDataTable } from 'mdbreact'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const MonJournalJual = () => {
  //fungsi
  useEffect(() => {
    let resGetJournalJualByDate = getJournalJualByDate(new Date())
    try {
      resGetJournalJualByDate.then(function (result) {
        console.log('resGetJournalJualByDate:', result.status)
        if (result.status === 'true') {
          setDataTable(result.message)
        }
      })
    } catch (err) {
      console.log(err)
    }

    let resGetFormatJournalJual = getFormatJournalJual(new Date())
    try {
      resGetFormatJournalJual.then(function (result) {
        console.log('resGetFormatJournalJual:', result.status)
        if (result.status === 'true') {
          setFormatTable(result.message)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }, [])

  const InputManual = () => {
    return (
      <div>
        <CFormLabel htmlFor="formFile">Input Manual</CFormLabel>
        <CFormInput
          autoFocus="autofocus"
          type="text"
          placeholder="Input manual Jenis Marketplace"
          aria-label="default input example"
          value={textInputManual}
          onChange={(e) => {
            setCursorInputManual(e.target.selectionStart)
            setTextInputManual(e.target.value)
          }}
          onFocus={(e) => {
            e.target.selectionStart = cursorInputManual
          }}
        />
        <br />
      </div>
    )
  }

  const TextErrorMessage = (props) => {
    return (
      <div className={props.IsError == 1 ? 'text-danger' : 'text-primary'}>
        <h6>{props.IsError == 1 ? props.Message : ''}</h6>
      </div>
    )
  }

  const handleOnSubmit = () => {
    let resGetJournalJualByDate = getJournalJualByDate(fileDate)
    try {
      resGetJournalJualByDate.then(function (result) {
        if (result.status === 'true') {
          setHideTable(false)
          setDataTable(result.message)
          setIsErrorMessage(0)
          setErrorMessage('')
        } else {
          setHideTable(true)
          setDataTable(null)
          setIsErrorMessage(1)
          setErrorMessage('Tidak ada jurnal jual pada tanggal ' + format(fileDate, 'dd-MM-yyyy'))
        }
      })
    } catch (err) {
      console.log(err)
    }
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
  const [textInputManual, setTextInputManual] = useState()
  const [cursorInputManual, setCursorInputManual] = useState(null)
  const [isErrorMessage, setIsErrorMessage] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [hideTable, setHideTable] = useState(true)
  const [dataTable, setDataTable] = useState(null)
  const [formatTable, setFormatTable] = useState(null)

  return (
    <Suspense fallback={loading}>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Journal Jual Harian</strong> {/*<small>File input</small>*/}
            </CCardHeader>
            <CCardBody>
              <CFormLabel htmlFor="formFile">Pilih Tanggal</CFormLabel>
              <div className="mb-1">
                <DatePicker
                  className="mb-3 text-center"
                  selected={fileDate}
                  onChange={(date: Date) => setFileDate(date)}
                />
                <div className="d-grid gap-2">
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
                </div>
              </div>
            </CCardBody>
          </CCard>
          {!hideTable && (
            <CCard className="mb-4">
              <CCardHeader>
                <strong>List Journal Jual Tanggal {format(fileDate, 'dd-MM-yyyy')}</strong>{' '}
              </CCardHeader>
              <CCardBody>
                <DatatablePage data={dataTable} />
              </CCardBody>
            </CCard>
          )}
        </CCol>
      </CRow>
    </Suspense>
  )
}

export default MonJournalJual
