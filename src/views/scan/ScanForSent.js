import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CFormSelect,
} from '@coreui/react'
import { checkAndUpdateResiForScan } from '../../utils/axios-request'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import { format } from 'date-fns'

const ScanForSent = () => {
  //function
  const handleOnEnterPressed = () => {
    var resMsg = ''
    try {
      let res = checkAndUpdateResiForScan(textInput, 'SEND')
      res.then(function (result) {
        console.log(result.status)
        if (result.status === 'true') {
          resMsg = 'Resi ' + textInput + ' berhasil di update untuk di kirim'
          setErrorMessage(resMsg)
          setArrScan([...arrScan, { resi: textInput, result: resMsg }])
          setIsErrorMessage(2)
        } else {
          resMsg = 'Resi ' + textInput + ' gagal di update untuk dikirim -  error:' + result.message
          setErrorMessage(resMsg)
          setArrScan([...arrScan, { resi: textInput, result: resMsg }])
          setIsErrorMessage(1)
        }
      })
    } catch (err) {
      resMsg = 'Resi ' + textInput + ' gagal di update untuk dikirim - error:' + err
      setErrorMessage(resMsg)
      setIsErrorMessage(1)
    }
    setArrScan([...arrScan, { resi: textInput, result: resMsg }])
    setTextInput('')
  }
  const TextErrorMessage = (props) => {
    return (
      <div>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Scan Result:</strong> {/*<small>File input</small>*/}
          </CCardHeader>
          <CCardBody>
            <h6 className={props.IsError == 1 ? 'text-danger' : 'text-primary'}>{props.Message}</h6>
          </CCardBody>
        </CCard>
      </div>
    )
  }
  const handleBtnStartClick = () => {
    setDisableBtnStart(true)
    setDisableBtnStop(false)
    setHideTable(true)
    setArrScan([])
  }
  const handleBtnStopClick = () => {
    setDisableBtnStart(false)
    setDisableBtnStop(true)
    setIsErrorMessage(0)
    if (arrScan.length > 0) {
      setHideTable(false)
    }
    console.log(arrScan)
  }
  const GenerateTable = (props) => {
    return (
      <div>
        <CTable id="emp">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Resi</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status Scan</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {props.data.map(({ resi, result }, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{resi}</CTableDataCell>
                <CTableDataCell>{result}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
    )
  }
  //state
  const [textInput, setTextInput] = useState('')
  const [cursorInput, setCursorInput] = useState(null)
  const [isErrorMessage, setIsErrorMessage] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [disableBtnStart, setDisableBtnStart] = useState(false)
  const [disableBtnStop, setDisableBtnStop] = useState(true)
  const [arrScan, setArrScan] = useState([])
  const [hideTable, setHideTable] = useState(true)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Scan Send</strong> {/*<small>File input</small>*/}
          </CCardHeader>
          <CCardHeader>
            <CRow>
              <CCol sm="auto">
                <CButton color="light" disabled={disableBtnStart} onClick={handleBtnStartClick}>
                  Start Scanning
                </CButton>
              </CCol>
              <CCol sm="auto">
                <CButton color="light" disabled={disableBtnStop} onClick={handleBtnStopClick}>
                  Stop Scanning
                </CButton>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CFormLabel htmlFor="formFile">Input Resi Untuk dikirim</CFormLabel>
            <CFormInput
              autoFocus="autofocus"
              type="text"
              placeholder="Kode Resi"
              aria-label="default input example"
              value={textInput}
              disabled={disableBtnStop}
              onChange={(e) => {
                setCursorInput(e.target.selectionStart)
                setTextInput(e.target.value)
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleOnEnterPressed()
                }
              }}
              onFocus={(e) => {
                e.target.selectionStart = cursorInput
              }}
            />
          </CCardBody>
        </CCard>

        {isErrorMessage > 0 && <TextErrorMessage IsError={isErrorMessage} Message={errorMessage} />}
        {!hideTable && (
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Hasil scan</strong>{' '}
            </CCardHeader>
            <CCardBody>
              <GenerateTable data={arrScan} />
            </CCardBody>
          </CCard>
        )}
        {!hideTable && (
          <CCard className="mb-4">
            {/* <CCardHeader>
              <strong>Hasil scan</strong>{' '}
            </CCardHeader> */}
            {/* <CSVLink data={arrScan} headers={headers}>
              Download csv
            </CSVLink> */}
            <ReactHTMLTableToExcel
              className="btn btn-secondary"
              table="emp"
              filename={'ReportScanSent_' + format(new Date(), 'dd-MM-yyyy HH:mm')}
              sheet="Sheet"
              buttonText="Save as excel"
            />
          </CCard>
        )}
      </CCol>
    </CRow>
  )
}

export default ScanForSent
