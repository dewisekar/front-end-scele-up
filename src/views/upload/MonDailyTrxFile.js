import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormLabel,
  CRow,
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
import { getDailyFile } from '../../utils/axios-request'
import { format } from 'date-fns'

const UploadDailyTrxFile = () => {
  //fungsi
  const TextErrorMessage = (props) => {
    return (
      <div className={props.IsError == 1 ? 'text-danger' : 'text-primary'}>
        <h6>{props.IsError == 1 ? props.Message : ''}</h6>
      </div>
    )
  }
  const GenerateTable = (props) => {
    return (
      <div>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>

              <CTableHeaderCell scope="col">Filename</CTableHeaderCell>

              <CTableHeaderCell scope="col">Channel</CTableHeaderCell>

              <CTableHeaderCell scope="col">Status File</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {props.data.map(({ FILENAME, CHANNEL, STATUSDESC }, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{FILENAME}</CTableDataCell>
                <CTableDataCell>{CHANNEL}</CTableDataCell>
                <CTableDataCell>{STATUSDESC}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
    )
  }
  const handleOnSubmit = () => {
    let resGetDailyFile = getDailyFile(fileDate)
    try {
      resGetDailyFile.then(function (result) {
        if (result.status === 'true') {
          result.message.map(({ FILENAME, CHANNEL, STATUSDESC }, index) =>
            console.log(index, ',', FILENAME, ',', CHANNEL, ',', STATUSDESC),
          )

          setDataTable(result.message)
          setHideTable(false)
          console.log(result.message)
          setIsErrorMessage(0)
          setErrorMessage('')
        } else {
          setHideTable(true)
          setIsErrorMessage(1)
          setDataTable(null)
          setErrorMessage(
            'Tidak ada file yang di upload pada tanggal ' + format(fileDate, 'dd-MM-yyyy'),
          )
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  //state
  const [fileDate, setFileDate] = useState(new Date())
  const [isErrorMessage, setIsErrorMessage] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [hideTable, setHideTable] = useState(true)
  const [dataTable, setDataTable] = useState(null)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Pengecekan file transaksi harian yang sudah di upload</strong>{' '}
            {/*<small>File input</small>*/}
          </CCardHeader>
          <CCardBody>
            <div className="mb-1">
              <CFormLabel htmlFor="formFile">Pilih Tanggal</CFormLabel>

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
              <strong>
                List File yang sudah di upload pada tanggal {format(fileDate, 'dd-MM-yyyy')}
              </strong>{' '}
              {/*<small>File input</small>*/}
            </CCardHeader>
            <CCardBody>
              <GenerateTable data={dataTable} />
            </CCardBody>
          </CCard>
        )}
      </CCol>
    </CRow>
  )
}

export default UploadDailyTrxFile
