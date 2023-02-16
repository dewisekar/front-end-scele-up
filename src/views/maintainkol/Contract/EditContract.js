import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Modal } from 'react-bootstrap'
import { CButton, CCard, CCardBody, CCol, CRow, CFormSelect, CSpinner } from '@coreui/react'
import { useSearchParams } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Select from 'react-select'

import {
  getKolDetailById,
  getSubMediaById,
  getRequestByUri,
  patchRequestByUri,
} from '../../../utils/request-marketing'
import { GeneralFormInput } from '../../../utils/GeneralFormInput'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import { usePromiseTracker } from 'react-promise-tracker'
import { Bars } from 'react-loader-spinner'
import { convertDataToSelectOptions } from '../../../utils/GeneralFormInput'
import { URL } from 'src/constants'
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const LoadingIndicator = (props) => {
  const { promiseInProgress } = usePromiseTracker()

  return (
    promiseInProgress && (
      <div
        style={{
          width: '100%',
          height: '100',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          top: '0',
          bottom: '0',
          left: '0',
          right: '0',
          zIndex: '1',
        }}
      >
        {/* <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" /> */}
        <Bars
          height="80"
          width="80"
          color="#8a93a2"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    )
  )
}

const calculateDP = (biaya, DP) => {
  let biayaInt = parseInt(biaya, 10)
  let DPInt = parseInt(DP, 10)
  let DPCalc = (biayaInt * DPInt) / 100
  return DPCalc
}

const formatCurrency = (numString) => {
  let curr = numString.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return curr
}

const unFormatCurrency = (numString) => {
  let num = numString.replace(/\./g, '')
  return num
}

const EditContract = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [kolId, setKolId] = useState(null)
  const [subMediaList, setSubMediaList] = useState(null)
  const [managerList, setManagerList] = useState([])

  const [bookingSlot, setBookingSlot] = useState('')
  const [biayaKerjaSama, setBiayaKerjaSama] = useState('')
  const [DPKerjaSama, setDPKerjaSama] = useState('')
  const [picAwal, setPicAwal] = useState('')
  const [fileMou, setFileMou] = useState('')
  const [jenisSubMedia, setJenisSubMedia] = useState('default')
  const [tanggalAwalKerjaSama, setTanggalAwalKerjaSama] = useState(new Date())
  const [tanggalAkhirKerjaSama, setTanggalAkhirKerjaSama] = useState(new Date())

  const [managerKol, setManagerKol] = useState('default')

  const convertData = (data, managerList) => {
    setJenisSubMedia(data['Sub Media'])
    setBookingSlot(data['Booking Slot'])
    setBiayaKerjaSama(data['Total Kerjasama'].toString())
    setDPKerjaSama(data.DP)
    const [chosenManager] = managerList.filter((item) => data['Manager Id'] === item['Manager Id'])
    setManagerKol({ value: chosenManager['Manager Id'], label: chosenManager['Manager Name'] })
    setTanggalAwalKerjaSama(new Date(data['Masa Kontrak Mulai']))
    setTanggalAkhirKerjaSama(new Date(data['Masa Kontrak Akhir']))
  }

  useEffect(() => {
    const fetchData = async () => {
      let id = searchParams.get('id')
      setId(id)

      const { message: fetchedDetail } = await getRequestByUri(URL.GET_CONTRACT_DETAIL + id)
      const { message: fetchedKol } = await getKolDetailById(fetchedDetail['Kol Id'])
      const { message: fetchedSubMedia } = await getSubMediaById(fetchedDetail['Kol Id'])
      const { message: fetchedManager } = await getRequestByUri('/getListManager')

      setKolId(fetchedDetail['Kol Id'])
      setDetailData(fetchedKol)
      setSubMediaList(fetchedSubMedia)
      setManagerList(fetchedManager)
      convertData(fetchedDetail, fetchedManager)
      setIsViewDetailData(true)
    }

    fetchData()
  }, [])

  const ShowRequestInputRef = useRef()

  const [isViewDetailDatta, setIsViewDetailData] = useState(false)
  const [detailData, setDetailData] = useState(null)
  const [id, setId] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [show, setShow] = useState(false)
  const [errMessage, setErrorMessage] = useState('')
  const [modalTitle, setModalTitle] = useState('')

  const handleClose = () => {
    setShow(false)
    window.location.reload()
  }

  const handleShow = () => setShow(true)

  const handleOnSubmit = async () => {
    let user = sessionStorage.getItem('user')
    let subMedia = jenisSubMedia
    let managerKOL = managerKol
    if (subMedia == 'default') {
      setErrorMessage('Please select sub media')
      setModalTitle('Submit Error')
      handleShow()
    } else if (bookingSlot == '') {
      setErrorMessage('Please input booking slot')
      setModalTitle('Submit Error')
      handleShow()
    } else if (biayaKerjaSama == '') {
      setErrorMessage('Please input biaya kerjasama')
      setModalTitle('Submit Error')
      handleShow()
    } else if (managerKOL == 'default') {
      setErrorMessage('Please select manager')
      setModalTitle('Submit Error')
      handleShow()
    } else if (DPKerjaSama == '') {
      setErrorMessage('Please input DP kerjasama')
      setModalTitle('Submit Error')
      handleShow()
    } else if (parseInt(DPKerjaSama, 10) > 100 || parseInt(DPKerjaSama, 10) <= 0) {
      setErrorMessage('DP Tidak Valid')
      setModalTitle('Submit Error')
      handleShow()
    } else {
      const payload = {
        subMedia,
        bookingSlot,
        biayaKerjaSama: parseFloat(biayaKerjaSama),
        managerId: managerKOL.value,
        tanggalAwalKerjaSama: format(tanggalAwalKerjaSama, 'yyyy-MM-dd'),
        tanggalAkhirKerjaSama: format(tanggalAkhirKerjaSama, 'yyyy-MM-dd'),
        dp: DPKerjaSama,
      }
      try {
        setIsSubmitting(true)
        const result = await patchRequestByUri(URL.CONTRACT_WITH_PARAMS + id, payload)
        if (result.status === 'true') {
          setModalTitle('Update Success')
          setErrorMessage('Update Kontrak Sukses, Kontrak ID :' + id)
          handleShow()
          console.log('success')
        } else {
          setModalTitle('Update Error')
          setErrorMessage('Gagal Update Kontrak')
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
      <Modal show={show} onHide={handleClose} backdrop={'static'}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errMessage}</Modal.Body>
      </Modal>
    )
  }

  // const resetAllVariable = () => {
  //   ShowRequestInputRef.current.resetBookingSlot()
  //   ShowRequestInputRef.current.resetBiayaKerjaSama()
  //   ShowRequestInputRef.current.resetPicAwal()
  //   ShowRequestInputRef.current.resetFileMou()
  //   ShowRequestInputRef.current.resetTanggalAwalKerjaSama()
  //   ShowRequestInputRef.current.resetTanggalAkhirKerjaSama()
  //   ShowRequestInputRef.current.resetJenisSubMedia()
  //   ShowRequestInputRef.current.resetDPKerjaSama()
  //   setIsViewDetailData(false)
  // }

  const renderRequestInput = () => {
    return (
      <CCard>
        <CCardBody>
          <CRow className="mb-1">
            <CCol xs={2}>
              <div className="p-2 border bg-light">Sub Media</div>
            </CCol>
            <CCol xs={10}>
              <CFormSelect
                aria-label="Large select example"
                onChange={(e) => {
                  setJenisSubMedia(e.target.value)
                }}
                value={jenisSubMedia}
              >
                <option value="default">Pilih Jenis</option>
                {subMediaList != null &&
                  subMediaList.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
              </CFormSelect>
            </CCol>
          </CRow>
          <CRow className="mb-1">
            <CCol xs={2}>
              <div className="p-2 border bg-light">Booking Slot</div>
            </CCol>
            <CCol xs={10}>
              <GeneralFormInput
                type="text"
                placeholder="input booking slot"
                value={bookingSlot}
                onChange={(event) => {
                  setBookingSlot(event.target.value)
                }}
                regexInput={/^[0-9\b]+$/}
              />
            </CCol>
          </CRow>
          <CRow className="mb-1">
            <CCol xs={2}>
              <div className="p-2 border bg-light">Biaya Kerjasama</div>
            </CCol>
            <CCol xs={10}>
              <GeneralFormInput
                type="text"
                placeholder="input biaya kerja sama"
                value={formatCurrency(biayaKerjaSama)}
                onChange={(event) => {
                  setBiayaKerjaSama(unFormatCurrency(event.target.value))
                }}
              />
            </CCol>
          </CRow>
          <CRow className="mb-1">
            <CCol xs={2}>
              <div className="p-2 border bg-light">DP Kerjasama (%)</div>
            </CCol>
            <CCol xs={10}>
              <GeneralFormInput
                type="text"
                placeholder="input DP kerja sama dalam persentase (jika fullpayment maka isi dengan angka 100)" //"Input uername KOL"
                value={DPKerjaSama}
                onChange={(event) => {
                  setDPKerjaSama(event.target.value)
                }}
                regexInput={/^[0-9\b]+$/}
              />
            </CCol>
          </CRow>
          {biayaKerjaSama != '' && DPKerjaSama != '' && (
            <CRow className="mb-1">
              <CCol xs={2}>
                <div className="p-2 border bg-light">Total DP</div>
              </CCol>
              <CCol xs={10}>
                <div className="p-2 border bg-light">
                  {formatCurrency(calculateDP(biayaKerjaSama, DPKerjaSama).toString())}
                </div>
              </CCol>
            </CRow>
          )}
          <CRow className="mb-1">
            <CCol xs={2}>
              <div className="p-2 border bg-light">Pilih Manager</div>
            </CCol>
            <CCol xs={10}>
              <Select
                options={convertDataToSelectOptions(managerList, 'Manager Id', 'Manager Name')}
                placeholder="Pilih Manager"
                isClearable
                value={managerKol}
                onChange={(e) => {
                  setManagerKol(e)
                }}
              />
            </CCol>
          </CRow>
          <CRow className="mb-1">
            <CCol xs={2}>
              <div className="p-2 border bg-light">Tanggal Awal Kerjasama</div>
            </CCol>
            <CCol xs={10}>
              <div className="p-2 border bg-light">
                <DatePicker
                  className="text-center"
                  selected={tanggalAwalKerjaSama}
                  onChange={(date: Date) => setTanggalAwalKerjaSama(date)}
                  value={tanggalAwalKerjaSama}
                />
              </div>
            </CCol>
          </CRow>
          <CRow className="mb-1">
            <CCol xs={2}>
              <div className="p-2 border bg-light">Tanggal Akhir Kerjasama</div>
            </CCol>
            <CCol xs={10}>
              <div className="p-2 border bg-light">
                <DatePicker
                  className="text-center"
                  selected={tanggalAkhirKerjaSama}
                  onChange={(date: Date) => setTanggalAkhirKerjaSama(date)}
                  value={tanggalAkhirKerjaSama}
                />
              </div>
            </CCol>
          </CRow>
          <CRow className="mt-4">
            {!isSubmitting ? (
              <CButton
                color="secondary"
                active={'active' === 'active'}
                variant="outline"
                key="1"
                onClick={() => {
                  handleOnSubmit()
                }}
              >
                Update
              </CButton>
            ) : (
              <CCol lg={12} className="text-center">
                <CSpinner color="primary" />
              </CCol>
            )}
          </CRow>
        </CCardBody>
      </CCard>
    )
  }

  const ShowDetailData = () => {
    return (
      <CCard>
        <CCardBody>
          <CRow className="mb-1">
            <CCol xs={3}>
              <div className="p-2 border bg-light">Nama</div>
            </CCol>
            <CCol xs={9}>
              <div className="p-2 border bg-light">{detailData.NAME}</div>
            </CCol>
          </CRow>
          <CRow className="mb-1">
            <CCol xs={3}>
              <div className="p-2 border bg-light">Username</div>
            </CCol>
            <CCol xs={9}>
              <div className="p-2 border bg-light">{detailData.USERNAME}</div>
            </CCol>
          </CRow>
          <CRow className="mb-1">
            <CCol xs={3}>
              <div className="p-2 border bg-light">Platform</div>
            </CCol>
            <CCol xs={9}>
              <div className="p-2 border bg-light">{detailData.PLATFORM}</div>
            </CCol>
          </CRow>
          <CRow className="mb-1">
            <CCol xs={3}>
              <div className="p-2 border bg-light">Jenis</div>
            </CCol>
            <CCol xs={9}>
              <div className="p-2 border bg-light">{detailData.JENIS}</div>
            </CCol>
          </CRow>
          <CRow className="mb-1">
            <CCol xs={3}>
              <div className="p-2 border bg-light">Kategori</div>
            </CCol>
            <CCol xs={9}>
              <div className="p-2 border bg-light">{detailData.kolCategory}</div>
            </CCol>
          </CRow>
          <CRow className="mb-1">
            <CCol xs={3}>
              <div className="p-2 border bg-light">No.HP</div>
            </CCol>
            <CCol xs={9}>
              <div className="p-2 border bg-light">{detailData.NO_HP}</div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    )
  }
  return (
    <Suspense fallback={loading}>
      <LoadingIndicator />
      <CRow>
        <ErrorModal />
        <CCol xs={12}>
          {isViewDetailDatta && detailData != null && <ShowDetailData />}
          {isViewDetailDatta && detailData != null && renderRequestInput()}
        </CCol>
      </CRow>
    </Suspense>
  )
}

export default EditContract
