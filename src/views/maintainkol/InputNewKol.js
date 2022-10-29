import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CBadge,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CFormSelect,
} from '@coreui/react'
// import DatePicker from 'react-datepicker'
// import 'react-datepicker/dist/react-datepicker.css'
// import { DocsCallout, DocsExample } from 'src/components'
import { insertNewKOL } from '../../utils/request-marketing'
// import { format } from 'date-fns'
// import fileDownload from 'js-file-download'

const InputNewKol = () => {
  const [jenisEndorse, setJenisEndorse] = useState('default')
  const [jenisPlatform, setJenisPlatform] = useState('default')
  const [kategoriKOL, setKategoriKOL] = useState('default')
  const [namaKOL, setNamaKol] = useState('')
  const [cursorNamaKOL, setCursorNamaKol] = useState(null)
  const [usernameKOL, setUserNamaKol] = useState('')
  const [cursorUsernameKOL, setCursorUsernameKol] = useState(null)
  const [cursorNoWhatsapp, setCursorNoWhatsapp] = useState(null)
  const [NoWhatsapp, setNoWhatsapp] = useState('')
  const [cursorAlamatKOL, setCursorAlamatKOL] = useState(null)
  const [AlamatKOL, setAlamatKOL] = useState('')
  const [cursorNorekKOL, setCursorNorekKOL] = useState(null)
  const [NorekKOL, setNorekKOL] = useState('')
  const [listJenisEndorse, setListJenisEndorse] = useState([
    'ED',
    'BA',
    'PP',
    'KAS',
    'GA',
    'Lain-lain',
    'Refund',
  ])
  const [listPlatform, setListPlatform] = useState([
    'Tiktok',
    'Instagram',
    'Twitter',
    'Youtube',
    'All Platform',
  ])
  const [listKategoriKol, setListKategoriKol] = useState([
    'Skinfluencer',
    'Skinfluencer Edukatif/Stortelling',
    'Makeup',
    'Cogan',
    'Cantik',
    'Couple',
    'Heboh/Fun',
    'Viral',
    'Farmasi',
    'Hair Influencer',
    'Skinfluencer Cowo',
    'Viral no irisan influencer',
    'Racun',
  ])
  const [show, setShow] = useState(false)
  const [errMessage, setErrorMessage] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const resetAllVariable = () => {
    setJenisEndorse('default')
    setJenisPlatform('default')
    setKategoriKOL('default')
    setNamaKol('')
    setUserNamaKol('')
    setNoWhatsapp('')
    setAlamatKOL('')
    setNorekKOL('')
  }
  const handleOnSubmit = () => {
    if (jenisEndorse == 'default') {
      setErrorMessage('Please input jenis KOL')
      setModalTitle('Submit Error')
      handleShow()
    } else if (jenisPlatform == 'default') {
      setErrorMessage('Please input jenis Platform')
      setModalTitle('Submit Error')
      handleShow()
    } else if (kategoriKOL == 'default') {
      setErrorMessage('Please input Kategori KOL')
      setModalTitle('Submit Error')
      handleShow()
    } else if (namaKOL == '') {
      setErrorMessage('Please input nama KOL')
      setModalTitle('Submit Error')
      handleShow()
    } else if (usernameKOL == '') {
      setErrorMessage('Please input username KOL')
      setModalTitle('Submit Error')
      handleShow()
    } else if (NoWhatsapp == '') {
      setErrorMessage('Please input no Whatsapp KOL')
      setModalTitle('Submit Error')
      handleShow()
    } else if (NorekKOL == '') {
      setErrorMessage('Please input no rekening KOL')
      setModalTitle('Submit Error')
      handleShow()
    } else if (AlamatKOL == '') {
      setErrorMessage('Please input alamat KOL')
      setModalTitle('Submit Error')
      handleShow()
    } else {
      try {
        let user = sessionStorage.getItem('user')
        let resInsertNewKOL = insertNewKOL(
          jenisEndorse,
          jenisPlatform,
          kategoriKOL,
          namaKOL,
          usernameKOL,
          NoWhatsapp,
          AlamatKOL,
          NorekKOL,
          user,
        )
        resInsertNewKOL.then(function (result) {
          if (result.status === 'true') {
            setModalTitle('Submit Success')
            setErrorMessage('Insert new kol success, KOL ID :' + result.kolId)
            handleShow()
            console.log('success')
            resetAllVariable()
          } else {
            setModalTitle('Submit Error')
            setErrorMessage('Gagal Insert New KOL')
            handleShow()
            console.log('err')
          }
        })
      } catch (err) {
        console.log(err)
        setErrorMessage(err)
        setShow(true)
      }
    }
  }

  const ErrorModal = () => {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errMessage}</Modal.Body>
      </Modal>
    )
  }
  return (
    <CRow>
      <ErrorModal />
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Input New Kol</strong> {/*<small>File input</small>*/}
          </CCardHeader>
          <CCardBody>
            <div>
              <CFormLabel htmlFor="formFile">Pilih Jenis KOL</CFormLabel>
              <CFormSelect
                className="mb-3"
                aria-label="Large select example"
                onChange={(e) => {
                  setJenisEndorse(e.target.value)
                  // if (e.target.value === 'Manual') {
                  //   setHideInputManual(false)
                  // } else {
                  //   setHideInputManual(true)
                  // }
                }}
              >
                <option value="default">Pilih Jenis</option>
                {listJenisEndorse.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </CFormSelect>
            </div>
            <div>
              <CFormLabel htmlFor="formFile">Pilih Jenis Platform</CFormLabel>
              <CFormSelect
                className="mb-3"
                aria-label="Large select example"
                onChange={(e) => {
                  setJenisPlatform(e.target.value)
                  // if (e.target.value === 'Manual') {
                  //   setHideInputManual(false)
                  // } else {
                  //   setHideInputManual(true)
                  // }
                }}
              >
                <option value="default">Pilih Jenis</option>
                {listPlatform.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </CFormSelect>
            </div>
            <div>
              <CFormLabel htmlFor="formFile">Pilih Kategori KOL</CFormLabel>
              <CFormSelect
                className="mb-3"
                aria-label="Large select example"
                onChange={(e) => {
                  setKategoriKOL(e.target.value)
                  // if (e.target.value === 'Manual') {
                  //   setHideInputManual(false)
                  // } else {
                  //   setHideInputManual(true)
                  // }
                }}
              >
                <option value="default">Pilih Jenis</option>
                {listKategoriKol.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="formFile">Nama KOL</CFormLabel>
              <CFormInput
                autoFocus="autofocus"
                type="text"
                placeholder="Input nama KOL"
                aria-label="default input example"
                value={namaKOL}
                onChange={(e) => {
                  setCursorNamaKol(e.target.selectionStart)
                  setNamaKol(e.target.value)
                }}
                onFocus={(e) => {
                  e.target.selectionStart = cursorNamaKOL
                }}
              />
            </div>
            <div>
              <CFormLabel htmlFor="formFile">Username KOL</CFormLabel>
              <CFormInput
                autoFocus="autofocus"
                type="text"
                placeholder="Input uername KOL"
                aria-label="default input example"
                value={usernameKOL}
                onChange={(e) => {
                  setCursorUsernameKol(e.target.selectionStart)
                  setUserNamaKol(e.target.value)
                }}
                onFocus={(e) => {
                  e.target.selectionStart = cursorUsernameKOL
                }}
              />
              <br />
            </div>
            <div>
              <CFormLabel htmlFor="formFile">No Whatsapp</CFormLabel>
              <CFormInput
                autoFocus="autofocus"
                type="text"
                pattern="[0-9]*"
                placeholder="Input nomor whatsapp"
                aria-label="default input example"
                value={NoWhatsapp}
                onChange={(e) => {
                  const re = /^[0-9\b]+$/
                  if (e.target.value === '' || re.test(e.target.value)) {
                    setCursorNoWhatsapp(e.target.selectionStart)
                    setNoWhatsapp(e.target.value)
                  }
                }}
                onFocus={(e) => {
                  e.target.selectionStart = cursorNoWhatsapp
                }}
              />
              <br />
            </div>
            <div>
              <CFormLabel htmlFor="formFile">No Rekening</CFormLabel>
              <CFormInput
                autoFocus="autofocus"
                type="text"
                pattern="[0-9]*"
                placeholder="Input nomor rekening"
                aria-label="default input example"
                value={NorekKOL}
                onChange={(e) => {
                  const re = /^[0-9\b]+$/
                  if (e.target.value === '' || re.test(e.target.value)) {
                    setCursorNorekKOL(e.target.selectionStart)
                    setNorekKOL(e.target.value)
                  }
                }}
                onFocus={(e) => {
                  e.target.selectionStart = cursorNorekKOL
                }}
              />
              <br />
            </div>
            <div>
              <CFormLabel htmlFor="formFile">Alamat KOL</CFormLabel>
              <CFormInput
                autoFocus="autofocus"
                type="text"
                placeholder="Input Alamat KOL"
                aria-label="default input example"
                value={AlamatKOL}
                onChange={(e) => {
                  setCursorAlamatKOL(e.target.selectionStart)
                  setAlamatKOL(e.target.value)
                }}
                onFocus={(e) => {
                  e.target.selectionStart = cursorAlamatKOL
                }}
              />
              <br />
            </div>
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
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default InputNewKol
