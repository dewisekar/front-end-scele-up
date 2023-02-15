import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CRow,
  CFormSelect,
  CSpinner,
} from '@coreui/react'
import Select from 'react-select'
import { useSearchParams } from 'react-router-dom'

import { patchRequestByUri, getKolDetailById } from '../../../utils/request-marketing'
import { execSPWithoutInput, getRequestByUri } from '../../../utils/request-marketing'
import { StoredProcedure, URL, Platform, KolType } from 'src/constants'
import { convertDataToSelectOptions } from '../../../utils/GeneralFormInput'

const EditKol = () => {
  const [jenisEndorse, setJenisEndorse] = useState('default')
  const [jenisPlatform, setJenisPlatform] = useState('default')
  const [kategoriKOL, setKategoriKOL] = useState(null)
  const [kodeBank, setKodeBank] = useState(null)
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
  const [cursorNoKTP, setCursorNoKTP] = useState(null)
  const [noKTP, setNoKTP] = useState('')
  const [listKategoriKol, setListKategoriKol] = useState([])
  const [listBank, setListBank] = useState([])
  const [show, setShow] = useState(false)
  const [errMessage, setErrorMessage] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [kolDetail, setKolDetail] = useState({})

  const setInitialState = (data, fetchedBank, fetchedCategory) => {
    const { ALAMAT, JENIS, KATEGORI, NAME, NOMOR_REKENING, NO_HP, PLATFORM, USERNAME, ktp, bank } =
      data

    const [chosenCategory] = fetchedCategory.filter((data) => data.id === KATEGORI)
    const [chosenBank] = fetchedBank.filter((data) => data.name === bank)

    setJenisEndorse(JENIS)
    setJenisPlatform(PLATFORM)
    setKategoriKOL({ value: chosenCategory.id, label: chosenCategory.category })
    setNamaKol(NAME)
    setUserNamaKol(USERNAME)
    setNoWhatsapp(NO_HP)
    setNorekKOL(NOMOR_REKENING)
    setAlamatKOL(ALAMAT)
    setNoKTP(ktp)
    setKodeBank({ value: chosenBank.code, label: chosenBank.name })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let id = searchParams.get('id')
        const { message: fetchedCategory } = await execSPWithoutInput(
          StoredProcedure.GET_KOL_CATEGORY,
        )
        const { message: fetchedKol } = await getKolDetailById(id)
        const { message: fetchedBank } = await getRequestByUri(URL.GET_BANK_LIST)

        setInitialState(fetchedKol, fetchedBank, fetchedCategory)
        setKolDetail(fetchedKol)
        setListKategoriKol(fetchedCategory)
        setListBank(fetchedBank)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  const handleOnSubmit = async () => {
    if (jenisEndorse === 'default') {
      setErrorMessage('Please input jenis KOL')
      setModalTitle('Submit Error')
      handleShow()
    } else if (jenisPlatform === 'default') {
      setErrorMessage('Please input jenis Platform')
      setModalTitle('Submit Error')
      handleShow()
    } else if (kategoriKOL === null) {
      setErrorMessage('Please input Kategori KOL')
      setModalTitle('Submit Error')
      handleShow()
    } else if (namaKOL === '') {
      setErrorMessage('Please input nama KOL')
      setModalTitle('Submit Error')
      handleShow()
    } else if (usernameKOL === '') {
      setErrorMessage('Please input username KOL')
      setModalTitle('Submit Error')
      handleShow()
    } else if (NoWhatsapp === '') {
      setErrorMessage('Please input no Whatsapp KOL')
      setModalTitle('Submit Error')
      handleShow()
    } else if (NorekKOL === '') {
      setErrorMessage('Please input no rekening KOL')
      setModalTitle('Submit Error')
      handleShow()
    } else if (kodeBank === null) {
      setErrorMessage('Please input bank')
      setModalTitle('Submit Error')
      handleShow()
    } else if (AlamatKOL === '') {
      setErrorMessage('Please input alamat KOL')
      setModalTitle('Submit Error')
      handleShow()
    } else if (noKTP === '') {
      setErrorMessage('Please input nomor KTP')
      setModalTitle('Submit Error')
      handleShow()
    } else {
      try {
        setIsSubmitting(true)
        const id = searchParams.get('id')
        const payload = {
          jenisEndorse,
          platform: jenisPlatform,
          kolCategory: kategoriKOL.value,
          name: namaKOL,
          username: usernameKOL,
          phoneNumber: NoWhatsapp,
          address: AlamatKOL,
          rekening: NorekKOL,
          ktp: noKTP,
          bank: kodeBank.value,
        }
        const result = await patchRequestByUri(URL.KOL_WITH_PARAMS + id, payload)
        if (result.status === 'true') {
          setModalTitle('Update Success')
          setErrorMessage('Update KOL Sukses, KOL ID :' + id)
          handleShow()
          console.log('success')
        } else {
          setModalTitle('Update Error')
          setErrorMessage('Gagal Update KOL')
          handleShow()
          console.log('err')
        }
        setIsSubmitting(false)
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
            <CRow className="mb-1">
              <CCol xs={3}>
                <div className="p-2 border bg-light">Pilih Jenis KOL</div>
              </CCol>
              <CCol xs={9}>
                <CFormSelect
                  aria-label="Large select example"
                  onChange={(e) => {
                    setJenisEndorse(e.target.value)
                  }}
                  value={jenisEndorse}
                >
                  <option value="default">Pilih Jenis</option>
                  {KolType.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-1">
              <CCol xs={3}>
                <div className="p-2 border bg-light">Pilih Jenis Platform</div>
              </CCol>
              <CCol xs={9}>
                <CFormSelect
                  aria-label="Large select example"
                  onChange={(e) => {
                    setJenisPlatform(e.target.value)
                  }}
                  value={jenisPlatform}
                >
                  <option value="default">Pilih Jenis Platform</option>
                  {Platform.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-1">
              <CCol xs={3}>
                <div className="p-2 border bg-light">Pilih Kategori KOL</div>
              </CCol>
              <CCol xs={9}>
                <Select
                  options={convertDataToSelectOptions(listKategoriKol, 'id', 'category')}
                  placeholder="Pilih Kategori KOL"
                  isClearable
                  value={kategoriKOL}
                  onChange={(e) => {
                    setKategoriKOL(e)
                  }}
                />
              </CCol>
            </CRow>
            <CRow className="mb-1">
              <CCol xs={3}>
                <div className="p-2 border bg-light">Nama KOL</div>
              </CCol>
              <CCol xs={9}>
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
              </CCol>
            </CRow>
            <CRow className="mb-1">
              <CCol xs={3}>
                <div className="p-2 border bg-light">Username KOL</div>
              </CCol>
              <CCol xs={9}>
                <CFormInput
                  autoFocus="autofocus"
                  type="text"
                  placeholder="Input username KOL"
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
              </CCol>
            </CRow>
            <CRow className="mb-1">
              <CCol xs={3}>
                <div className="p-2 border bg-light">No Whatsapp</div>
              </CCol>
              <CCol xs={9}>
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
              </CCol>
            </CRow>
            <CRow className="mb-1">
              <CCol xs={3}>
                <div className="p-2 border bg-light">No Rekening</div>
              </CCol>
              <CCol xs={9}>
                <CFormInput
                  autoFocus="autofocus"
                  type="text"
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
              </CCol>
            </CRow>
            <CRow className="mb-1">
              <CCol xs={3}>
                <div className="p-2 border bg-light">Pilih Bank</div>
              </CCol>
              <CCol xs={9}>
                <Select
                  options={convertDataToSelectOptions(listBank, 'code', 'name')}
                  placeholder="Pilih Bank"
                  isClearable
                  value={kodeBank}
                  onChange={(e) => {
                    setKodeBank(e)
                  }}
                />
              </CCol>
            </CRow>
            <CRow className="mb-1">
              <CCol xs={3}>
                <div className="p-2 border bg-light">Alamat KOL</div>
              </CCol>
              <CCol xs={9}>
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
              </CCol>
            </CRow>
            <CRow className="mb-1">
              <CCol xs={3}>
                <div className="p-2 border bg-light">NIK</div>
              </CCol>
              <CCol xs={9}>
                <CFormInput
                  autoFocus="autofocus"
                  type="text"
                  placeholder="Input NIK"
                  aria-label="default input example"
                  value={noKTP}
                  onChange={(e) => {
                    setCursorNoKTP(e.target.selectionStart)
                    setNoKTP(e.target.value)
                  }}
                  onFocus={(e) => {
                    e.target.selectionStart = cursorNoKTP
                  }}
                />
              </CCol>
            </CRow>
            <div className="d-grid gap-2 mt-4">
              {!isSubmitting ? (
                <CButton
                  color="secondary"
                  active={'active' === 'active'}
                  variant="outline"
                  key="1"
                  onClick={handleOnSubmit}
                >
                  Save
                </CButton>
              ) : (
                <CCol lg={12} className="text-center">
                  <CSpinner color="primary" />
                </CCol>
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default EditKol
