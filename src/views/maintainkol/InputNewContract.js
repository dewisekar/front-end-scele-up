import React, {
  useState,
  useEffect,
  useImperativeHandle,
  useRef,
  forwardRef,
  Suspense,
} from 'react'
import { Modal } from 'react-bootstrap'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CFormSelect } from '@coreui/react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import {
  getALLKolName,
  getKolDetailById,
  getSubMediaById,
  insertNewKontrak,
  getRequestByUri,
} from '../../utils/request-marketing'
import { GeneralFormInput } from '../../utils/GeneralFormInput'
// import ControlledInput from '../../utils/GeneralFormInput'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const InputNewContract = () => {
  useEffect(() => {
    let resGetALLKolName = getALLKolName()
    try {
      resGetALLKolName.then(function (result) {
        console.log('resGetALLKolName:', result.status)
        if (result.status === 'true') {
          setListKolName(result.message)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }, [])
  const ShowRequestInputRef = useRef()
  const [listKolName, setListKolName] = useState(null)
  const [listSubMedia, setListSubMedia] = useState(null)
  const [isViewDetailDatta, setIsViewDetailData] = useState(false)
  const [detailData, setDetailData] = useState(null)
  const [id, setId] = useState(0)

  const [show, setShow] = useState(false)
  const [errMessage, setErrorMessage] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const inputNameHandle = (value) => {
    if (value != null) {
      let id = value.ID
      let resGetKolDetailById = getKolDetailById(id)
      try {
        resGetKolDetailById.then(function (result) {
          console.log('resGetKolDetailById:', result.status)
          if (result.status === 'true') {
            setId(id)
            setIsViewDetailData(true)
            setDetailData(result.message)
          }
        })
      } catch (err) {
        console.log(err)
      }
    } else {
      setIsViewDetailData(false)
    }
  }

  const handleOnSubmit = () => {
    console.log('tes masuk sini ga')
    let user = sessionStorage.getItem('user')
    let subMedia = ShowRequestInputRef.current.getJenisSubMedia()
    let bookingSlot = ShowRequestInputRef.current.getBookingSlot()
    let biayaKerjaSama = ShowRequestInputRef.current.getBiayaKerjaSama()
    let tanggalAwalKerjaSama = ShowRequestInputRef.current.getTanggalAwalKerjaSama()
    let tanggalAkhirKerjaSama = ShowRequestInputRef.current.getTanggalAkhirKerjaSama()
    let managerKOL = ShowRequestInputRef.current.getManagerKOL()
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
    } else {
      console.log('masuk sini gak')
      try {
        let resInsertNewKontrak = insertNewKontrak(
          id,
          subMedia,
          bookingSlot,
          biayaKerjaSama,
          managerKOL,
          format(tanggalAwalKerjaSama, 'yyyy-MM-dd'),
          format(tanggalAkhirKerjaSama, 'yyyy-MM-dd'),
          user,
        )
        resInsertNewKontrak.then(function (result) {
          if (result.status === 'true') {
            setModalTitle('Submit Success')
            setErrorMessage(
              'Insert new kontrak success, Kontrak ID : ' +
                result.kontrakId +
                ', Kontrak Ke : ' +
                result.kontrakKe,
            )
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

  const resetAllVariable = () => {
    ShowRequestInputRef.current.resetBookingSlot()
    ShowRequestInputRef.current.resetBiayaKerjaSama()
    ShowRequestInputRef.current.resetPicAwal()
    ShowRequestInputRef.current.resetFileMou()
    ShowRequestInputRef.current.resetTanggalAwalKerjaSama()
    ShowRequestInputRef.current.resetTanggalAkhirKerjaSama()
    ShowRequestInputRef.current.resetJenisSubMedia()
    setIsViewDetailData(false)
  }

  const ShowRequestInput = forwardRef((props, _ref) => {
    const { onSubmit, id, ...rest } = props
    const [bookingSlot, setBookingSlot] = useState('')
    const [biayaKerjaSama, setBiayaKerjaSama] = useState('')
    const [picAwal, setPicAwal] = useState('')
    const [fileMou, setFileMou] = useState('')
    const [subMediaList, setSubMediaList] = useState(null)
    const [jenisSubMedia, setJenisSubMedia] = useState('default')
    const [tanggalAwalKerjaSama, setTanggalAwalKerjaSama] = useState(new Date())
    const [tanggalAkhirKerjaSama, setTanggalAkhirKerjaSama] = useState(new Date())
    const [managerList, setManagerList] = useState(null)
    const [managerKol, setManagerKol] = useState('default')

    useEffect(() => {
      let resGetSubMediaById = getSubMediaById(id)
      try {
        resGetSubMediaById.then(function (result) {
          console.log('resGetSubMediaById:', result.message)
          if (result.status === 'true') {
            setSubMediaList(result.message)
          }
        })
      } catch (err) {
        console.log(err)
      }

      let resGetListManager = getRequestByUri('/getListManager')
      try {
        resGetListManager.then(function (result) {
          console.log('resGetListManager:', result.status)
          if (result.status === 'true') {
            setManagerList(result.message)
          }
        })
      } catch (err) {
        console.log(err)
      }
    }, [])
    useImperativeHandle(_ref, () => ({
      getJenisSubMedia: () => {
        return jenisSubMedia
      },
      resetJenisSubMedia: () => {
        setJenisSubMedia('default')
      },
      getBookingSlot: () => {
        return bookingSlot
      },
      resetBookingSlot: () => {
        setBookingSlot('')
      },
      getBiayaKerjaSama: () => {
        return biayaKerjaSama
      },
      resetBiayaKerjaSama: () => {
        setBiayaKerjaSama('')
      },
      getPicAwal: () => {
        return picAwal
      },
      resetPicAwal: () => {
        setPicAwal('')
      },
      getFileMou: () => {
        return fileMou
      },
      resetFileMou: () => {
        setFileMou('')
      },
      getTanggalAwalKerjaSama: () => {
        return tanggalAwalKerjaSama
      },
      resetTanggalAwalKerjaSama: () => {
        setTanggalAwalKerjaSama(new Date())
      },
      getTanggalAkhirKerjaSama: () => {
        return tanggalAkhirKerjaSama
      },
      resetTanggalAkhirKerjaSama: () => {
        setTanggalAkhirKerjaSama(new Date())
      },
      getManagerKOL: () => {
        return managerKol
      },
      resetManagerKOL: () => {
        setManagerKol('default')
      },
    }))
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
                  // if (e.target.value === 'Manual') {
                  //   setHideInputManual(false)
                  // } else {
                  //   setHideInputManual(true)
                  // }
                }}
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
                // autoFocus="autofocus"
                type="text"
                placeholder="input booking slot" //"Input uername KOL"
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
                // autoFocus="autofocus"
                type="text"
                placeholder="input biaya kerja sama" //"Input uername KOL"
                value={biayaKerjaSama}
                onChange={(event) => {
                  setBiayaKerjaSama(event.target.value)
                }}
                regexInput={/^[0-9\b]+$/}
              />
            </CCol>
          </CRow>
          {/* <CRow className="mb-1">
            <CCol xs={2}>
              <div className="p-2 border bg-light">PIC Awal</div>
            </CCol>
            <CCol xs={10}>
              <GeneralFormInput
                // autoFocus="autofocus"
                type="text"
                placeholder="input pic awal" //"Input uername KOL"
                value={picAwal}
                onChange={(event) => {
                  setPicAwal(event.target.value)
                }}
              />
            </CCol>
          </CRow> */}
          <CRow className="mb-1">
            <CCol xs={2}>
              <div className="p-2 border bg-light">Pilih Manager</div>
            </CCol>
            <CCol xs={10}>
              <CFormSelect
                aria-label="Large select example"
                onChange={(e) => {
                  setManagerKol(e.target.value)
                }}
              >
                <option value="default">Pilih Manager</option>
                {managerList != null &&
                  managerList.map((value, index) => (
                    <option key={index} value={value['Manager Id']}>
                      {value['Manager Name']}
                    </option>
                  ))}
              </CFormSelect>
            </CCol>
          </CRow>
          {/* <CRow className="mb-1">
            <CCol xs={2}>
              <div className="p-2 border bg-light">Link file MoU</div>
            </CCol>
            <CCol xs={10}>
              <GeneralFormInput
                // autoFocus="autofocus"
                type="text"
                placeholder="input link file MoU" //"Input uername KOL"
                value={fileMou}
                onChange={(event) => {
                  setFileMou(event.target.value)
                }}
              />
            </CCol>
          </CRow> */}
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
                />
              </div>
            </CCol>
          </CRow>
          <CRow className="mt-4">
            <CButton
              color="secondary"
              active={'active' === 'active'}
              variant="outline"
              key="1"
              onClick={() => {
                // console.log('listSubMedia:', listSubMedia)
                onSubmit()
              }}
            >
              Submit
            </CButton>
          </CRow>
        </CCardBody>
      </CCard>
    )
  })
  ShowRequestInput.displayName = 'ShowRequestInput'

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
              <div className="p-2 border bg-light">{detailData.KATEGORI}</div>
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
    // <Suspense fallback={loading}>
    <CRow>
      <ErrorModal />
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Input new contract</strong>
          </CCardHeader>
          <CCardBody>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={listKolName}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Please input KOL name" size="small" />
              )}
              onChange={(event, value) => inputNameHandle(value)}
            />
          </CCardBody>
        </CCard>
        {isViewDetailDatta && detailData != null && <ShowDetailData />}
        {isViewDetailDatta && detailData != null && (
          <ShowRequestInput ref={ShowRequestInputRef} onSubmit={handleOnSubmit} id={id} />
        )}
      </CCol>
    </CRow>
    // </Suspense>
  )
}

export default InputNewContract
