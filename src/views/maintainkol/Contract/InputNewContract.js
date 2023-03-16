import React, {
  useState,
  useEffect,
  useImperativeHandle,
  useRef,
  forwardRef,
  Suspense,
} from 'react'
import { Modal } from 'react-bootstrap'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormSelect,
  CSpinner,
} from '@coreui/react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Select from 'react-select'

import {
  getALLKolName,
  getKolDetailById,
  getSubMediaById,
  insertNewKontrak,
  getRequestByUri,
} from '../../../utils/request-marketing'
import { generalDownload } from '../../../utils/axios-request'
import { GeneralFormInput } from '../../../utils/GeneralFormInput'
import { LoadingAnimation } from 'src/components'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import fileDownload from 'js-file-download'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
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
const InputNewContract = () => {
  useEffect(() => {
    const fetchData = async () => {
      const { message: fetchedKol = [] } = await getALLKolName()
      const convertedKol = convertDataToSelectOptions(fetchedKol, 'ID', 'label')
      const { message: fetchedActiveKol = [] } = await getRequestByUri(URL.GET_ACTIVE_KOL)
      const mappedActiveKol = fetchedActiveKol.map((data) => {
        return { value: data.kolId, label: data.kolName }
      })
      const activeIds = []
      mappedActiveKol.forEach((data) => activeIds.push(data.value))

      const notActiveKol = fetchedKol.filter((kol) => !activeIds.includes(kol.value))
      setListKolName({
        ALL: convertedKol,
        WITH_CONTRACT: mappedActiveKol,
        WITHOUT_CONTRACT: notActiveKol,
      })
      setIsInitialLoading(false)
    }

    fetchData()
  }, [])

  const filter = [
    { value: 'ALL', label: 'All KOL' },
    { value: 'WITH_CONTRACT', label: 'KOL dengan Kontrak' },
    { value: 'WITHOUT_CONTRACT', label: 'KOL tanpa Kontrak' },
  ]

  const ShowRequestInputRef = useRef()
  const [listKolName, setListKolName] = useState({
    ALL: [],
    WITH_CONTRACT: [],
    WITHOUT_CONTRACT: [],
  })
  const [listSubMedia, setListSubMedia] = useState([])
  const [chosenFilter, setChosenFilter] = useState({ value: 'ALL', label: 'All KOL' })
  const [isViewDetailData, setIsViewDetailData] = useState(false)
  const [detailData, setDetailData] = useState(null)
  const [id, setId] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)

  const [show, setShow] = useState(false)
  const [errMessage, setErrorMessage] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const handleClose = () => {
    setShow(false)
    window.location.reload()
  }
  const handleShow = () => setShow(true)

  const [showButtonDownloadFIle, setShowButtonDownloadFIle] = useState(false)
  const [fileId, setFileId] = useState(null)
  const [disableBtnDwnld, setDisableBtnDwnld] = useState(false)

  const inputNameHandle = (id) => {
    setIsLoadingDetail(true)
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
    setIsLoadingDetail(false)
  }

  const changeFilterHandler = (value) => {
    setChosenFilter(value)
    setDetailData(null)
  }

  const handleOnSubmit = () => {
    let user = sessionStorage.getItem('user')
    let subMedia = ShowRequestInputRef.current.getJenisSubMedia()
    let bookingSlot = ShowRequestInputRef.current.getBookingSlot()
    let biayaKerjaSama = ShowRequestInputRef.current.getBiayaKerjaSama()
    let DPKerjaSama = ShowRequestInputRef.current.getDPKerjaSama()
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
    } else if (DPKerjaSama == '') {
      setErrorMessage('Please input DP kerjasama')
      setModalTitle('Submit Error')
      handleShow()
    } else if (parseInt(DPKerjaSama, 10) > 100 || parseInt(DPKerjaSama, 10) <= 0) {
      setErrorMessage('DP Tidak Valid')
      setModalTitle('Submit Error')
      handleShow()
    } else {
      setIsSubmitting(true)
      try {
        trackPromise(
          insertNewKontrak(
            id,
            subMedia,
            bookingSlot,
            biayaKerjaSama,
            DPKerjaSama,
            managerKOL,
            format(tanggalAwalKerjaSama, 'yyyy-MM-dd'),
            format(tanggalAkhirKerjaSama, 'yyyy-MM-dd'),
            user,
          )
            .then(function (result) {
              if (result.status === 'true') {
                setModalTitle('Submit Success')
                let errorMessage =
                  'Insert new kontrak success, Kontrak ID : ' +
                  result.kontrakId +
                  ', Kontrak Ke : ' +
                  result.kontrakKe

                if (result.filename !== undefined) {
                  let fileKontrak = result.filename
                  trackPromise(
                    generalDownload('/downloadFile?file=' + fileKontrak).then(function (result) {
                      console.log('resDownloadFile: ', result)
                      if (result !== undefined) {
                        let fileOnly = fileKontrak.split('/')[fileKontrak.split('/').length - 1]
                        console.log('fileOnly:', fileOnly)
                        fileDownload(result, fileOnly)
                      }
                    }),
                  ).catch((error) => console.error(error))
                } else {
                  errorMessage = errorMessage + '\n File still being processed'
                  setShowButtonDownloadFIle(true)
                  setFileId(result.FILE_ID)
                }
                // let fileName = result.filename
                setErrorMessage(errorMessage)
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
            .catch((error) => console.error(error)),
        )
      } catch (err) {
        console.log(err)
        setErrorMessage(err)
        setShow(true)
      }
      setIsSubmitting(false)
    }
  }

  const ErrorModal = () => {
    return (
      <Modal show={show} onHide={handleClose} backdrop={'static'}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errMessage}</Modal.Body>
        {showButtonDownloadFIle && (
          <Modal.Body>
            <CButton color="light" disabled={disableBtnDwnld} onClick={downloadFile}>
              Check File
            </CButton>
          </Modal.Body>
        )}
      </Modal>
    )
  }

  const downloadFile = () => {
    let resGetFileName = getRequestByUri('/checkFileStatus?FileId=' + fileId.toString())
    try {
      resGetFileName.then(function (result) {
        console.log('checkFileStatus:', result)
        if (result !== undefined) {
          if (result.status === 'true') {
            let filename = result.filename
            let resDownloadFile = generalDownload('/downloadFile?file=' + filename)
            try {
              resDownloadFile.then(function (result) {
                console.log('resDownloadFile: ', result)
                if (result !== undefined) {
                  let fileOnly = filename.split('/')[filename.split('/').length - 1]
                  console.log('fileOnly:', fileOnly)
                  fileDownload(result, fileOnly)
                  setDisableBtnDwnld(true)
                }
              })
            } catch (err) {
              console.log(err)
            }
          }
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  const resetAllVariable = () => {
    ShowRequestInputRef.current.resetBookingSlot()
    ShowRequestInputRef.current.resetBiayaKerjaSama()
    ShowRequestInputRef.current.resetPicAwal()
    ShowRequestInputRef.current.resetFileMou()
    ShowRequestInputRef.current.resetTanggalAwalKerjaSama()
    ShowRequestInputRef.current.resetTanggalAkhirKerjaSama()
    ShowRequestInputRef.current.resetJenisSubMedia()
    ShowRequestInputRef.current.resetDPKerjaSama()
    setIsViewDetailData(false)
  }

  const ShowRequestInput = forwardRef((props, _ref) => {
    const { onSubmit, id, ...rest } = props
    const [bookingSlot, setBookingSlot] = useState('')
    const [biayaKerjaSama, setBiayaKerjaSama] = useState('')
    const [DPKerjaSama, setDPKerjaSama] = useState('')
    const [picAwal, setPicAwal] = useState('')
    const [fileMou, setFileMou] = useState('')
    const [subMediaList, setSubMediaList] = useState(null)
    const [jenisSubMedia, setJenisSubMedia] = useState('default')
    const [tanggalAwalKerjaSama, setTanggalAwalKerjaSama] = useState(new Date())
    const [tanggalAkhirKerjaSama, setTanggalAkhirKerjaSama] = useState(new Date())
    const [managerList, setManagerList] = useState([])
    const [managerKol, setManagerKol] = useState('default')

    useEffect(() => {
      let resGetSubMediaById = getSubMediaById(id)
      try {
        resGetSubMediaById.then(function (result) {
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
      getDPKerjaSama: () => {
        return DPKerjaSama
      },
      resetDPKerjaSama: () => {
        setDPKerjaSama('')
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
        return managerKol.value
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
                type="text"
                placeholder="input biaya kerja sama" //"Input uername KOL"
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
                // autoFocus="autofocus"
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
            {!isSubmitting ? (
              <CButton
                color="secondary"
                active={'active' === 'active'}
                variant="outline"
                key="1"
                onClick={() => {
                  onSubmit()
                }}
              >
                Submit
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
  })
  ShowRequestInput.displayName = 'ShowRequestInput'

  const renderLoadingAnimation = () => {
    return <LoadingAnimation />
  }

  const renderDetailData = () => {
    return (
      <>
        <ShowDetailData />
        <ShowRequestInput ref={ShowRequestInputRef} onSubmit={handleOnSubmit} id={id} />
      </>
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
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Input new contract</strong>
            </CCardHeader>
            <CCardBody>
              {isInitialLoading ? (
                renderLoadingAnimation()
              ) : (
                <>
                  <CRow className="mb-2">
                    <CCol>
                      <b>Filter:</b>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={3}>
                      <Select
                        placeholder="Select Filter..."
                        styles={{ width: '100% !important' }}
                        options={filter}
                        value={chosenFilter}
                        onChange={(event) => changeFilterHandler(event)}
                      />
                    </CCol>
                    <CCol md={4}>
                      <Select
                        placeholder="Select KOL..."
                        styles={{ width: '100% !important' }}
                        options={listKolName[chosenFilter.value]}
                        onChange={({ value }) => inputNameHandle(value)}
                      />
                    </CCol>
                  </CRow>
                </>
              )}
            </CCardBody>
          </CCard>
          {isLoadingDetail && renderLoadingAnimation()}
          {isViewDetailData && detailData != null && !isLoadingDetail && renderDetailData()}
        </CCol>
      </CRow>
    </Suspense>
  )
}

export default InputNewContract
