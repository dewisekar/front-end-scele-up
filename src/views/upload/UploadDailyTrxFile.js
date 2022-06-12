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
import 'react-datepicker/dist/react-datepicker.css'
import { DocsCallout, DocsExample } from 'src/components'
import { checkDailyFile, uploadFile, insertDailyFile } from '../../utils/axios-request'
import { format } from 'date-fns'

const UploadDailyTrxFile = () => {
  //fungsi
  const TextErrorMessage = (props) => {
    return (
      <div className={props.IsError == 1 ? 'text-danger' : 'text-primary'}>
        <h6>{props.IsError == 1 ? props.Message : 'File berhasil diupload'}</h6>
      </div>
    )
  }
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
  const handleOnSubmit = () => {
    let channel = marketplace == 'Manual' ? textInputManual : marketplace
    //let filename = selectedFile.name
    let filename = /*channel + '_' + format(fileDate, 'yyyyMMdd') + '_' +*/ selectedFile.name
    let isMarketplace = 'Manual' ? 'Y' : 'N'
    console.log('channel:', channel)
    console.log('filename:', filename)
    console.log('isMarketplace:', isMarketplace)

    let res = checkDailyFile(filename, channel, isMarketplace)
    try {
      res.then(function (result) {
        if (result.status === 'false') {
          console.log('result', result)
          const formData = new FormData()
          console.log(selectedFile.name.split('.'))
          formData.append(
            'myFile',
            selectedFile,
            // filename + '.' + selectedFile.name.split('.')[selectedFile.name.split('.').length - 1],
            filename,
          )
          let resUpload = uploadFile(formData)
          try {
            resUpload.then(function (result) {
              if (result.status === 'true') {
                let rescheckDailyFile = insertDailyFile(filename, channel, isMarketplace, fileDate)
                try {
                  rescheckDailyFile.then(function (result) {
                    console.log('insert success:', result)
                  })
                } catch (err) {
                  console.log('err insert:', err)
                }
                alert('File berhasil di upload')
                setIsErrorMessage(2)
              } else {
                setIsErrorMessage(1)
                setErrorMessage(result.message)
              }
              console.log('Status upload file ', filename, ' : ', result)
            })
          } catch (err) {
            console.log('File gagal di upload', err)
            setIsErrorMessage(1)
            setErrorMessage(err.toString())
          }
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
  const handleFileInput = (e) => {
    const file = e.target.files[0]
    console.log('filename :', file.name, '\t filetype:', file.name.split('.')[1])
    /*if (file.type != 'csv') alert('Format file harus csv')
    else*/ setSelectedFile(file)
  }

  //state
  const [fileDate, setFileDate] = useState(new Date())
  const [marketplace, setMarketPlace] = useState('default')
  const [hideInputManual, setHideInputManual] = useState(true)
  const [textInputManual, setTextInputManual] = useState()
  const [cursorInputManual, setCursorInputManual] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isErrorMessage, setIsErrorMessage] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const templateFileDir = './../../public/files/Contoh File yang akan diupload.xlsx'

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Input File Harian Transaksi</strong> {/*<small>File input</small>*/}
          </CCardHeader>
          <CCardBody>
            <div className="mb-3">
              <CFormLabel htmlFor="formFile">Pilih Marketplace</CFormLabel>
              <CFormSelect
                className="mb-3"
                aria-label="Large select example"
                value={marketplace}
                onChange={(e) => {
                  setMarketPlace(e.target.value)
                  if (e.target.value === 'Manual') {
                    setHideInputManual(false)
                  } else {
                    setHideInputManual(true)
                  }
                }}
              >
                <option value="default">Pilih Marketplace</option>
                <option value="Shopee">Shopee</option>
                <option value="Tiktok">Tiktok</option>
                <option value="Tokopedia">Tokopedia</option>
                <option value="Manual">Pilih manual</option>
              </CFormSelect>
              {!hideInputManual && <InputManual />}
              {/* <CFormLabel htmlFor="formFile">Pilih Tanggal</CFormLabel>

              <DatePicker
                className="mb-3 text-center"
                selected={fileDate}
                onChange={(date: Date) => setFileDate(date)}
              /> */}
              <CFormLabel htmlFor="formFile">Upload File</CFormLabel>
              <CFormInput className="mb-4" type="file" id="formFile" onChange={handleFileInput} />
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
                {/* <Link
                  to="../../../public/files/Contoh File yang akan diupload.xlsx"
                  target="_blank"
                  download
                >
                  Download Format File
                </Link> */}
                <a href={templateFileDir} download>
                  Download Template
                </a>
              </div>
            </div>
            {isErrorMessage > 0 && (
              <TextErrorMessage IsError={isErrorMessage} Message={errorMessage} />
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default UploadDailyTrxFile
