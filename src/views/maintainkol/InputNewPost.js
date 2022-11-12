import React, { useEffect, useState, Suspense } from 'react'
import { Modal } from 'react-bootstrap'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CFormSelect } from '@coreui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { GeneralFormInput, GeneralTextArea } from '../../utils/GeneralFormInput'
import { getRequestByUri, insertNewPost } from '../../utils/request-marketing'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const InputNewPost = () => {
  const [state, setState] = useState({})
  const [tanggalUpKontrak, setTanggalUpKontrak] = useState(new Date())
  const [kontrakKol, setKontrakKol] = useState('default')
  const [managerKol, setManagerKol] = useState('default')
  const [briefCode, setBriefCode] = useState('default')
  const [linkPost, setLinkPost] = useState('')
  const [productAttached, setProductAttached] = useState('default')

  const [productList, setProductList] = useState(null)
  const [kolList, setKolList] = useState(null)
  const [managerList, setManagerList] = useState(null)
  const [briefCodeList, setBriefCodeList] = useState(null)
  const [kolDetail, setKolDetail] = useState(null) //need to reset

  const [show, setShow] = useState(false)
  const [errMessage, setErrorMessage] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  useEffect(() => {
    let resGetListKontrakIteration = getRequestByUri('/getListKontrakIteration')
    try {
      resGetListKontrakIteration.then(function (result) {
        console.log('resGetListKontrakIteration:', result.status)
        if (result.status === 'true') {
          setKolList(result.message)
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
    let resGetListBrief = getRequestByUri('/getListBrief')
    try {
      resGetListBrief.then(function (result) {
        console.log('resGetListBrief:', result.status)
        if (result.status === 'true') {
          setBriefCodeList(result.message)
        }
      })
    } catch (err) {
      console.log(err)
    }
    return () => {
      setState({}) // This worked for me
    }
  }, [])

  const resetAllVariable = () => {
    setKontrakKol('default')
    setManagerKol('default')
    setBriefCode('default')
    setLinkPost('')
  }

  const handleOnSubmit = () => {
    if (kontrakKol == 'default') {
      setErrorMessage('Please select KOL')
      setModalTitle('Submit Error')
      handleShow()
    } else if (managerKol == 'default') {
      setErrorMessage('Please select manager')
      setModalTitle('Submit Error')
      handleShow()
    } else if (briefCode == 'default') {
      setErrorMessage('Please select brief')
      setModalTitle('Submit Error')
      handleShow()
    } else if (linkPost == '') {
      setErrorMessage('Please fill link post')
      setModalTitle('Submit Error')
      handleShow()
    } else {
      let user = sessionStorage.getItem('user')
      let resInsertNewPost = insertNewPost(kontrakKol, managerKol, briefCode, linkPost, user)
      try {
        resInsertNewPost.then(function (result) {
          console.log('resInsertNewPost:', result.status)
          if (result.status === 'true') {
            setModalTitle('Submit Success')
            setErrorMessage('Insert new post success, Post Id : ' + result.postId)
            handleShow()
            console.log('success')
            resetAllVariable()
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

  const handleSelectedKol = (index) => {
    if (index == 'default') {
      setKolDetail(null)
    } else {
      let kolId = kolList[index]['Kol Id']
      let kontrakId = kolList[index]['Kontrak Id']
      setKontrakKol(kontrakId)
      let resGetKolDetail = getRequestByUri('/getKolDetail?Id=' + kolId.toString())
      try {
        resGetKolDetail.then(function (result) {
          console.log('resGetKolDetail:', result.status)
          if (result.status === 'true') {
            setKolDetail(result.message)
          }
        })
      } catch (err) {
        console.log(err)
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
    <Suspense fallback={loading}>
      <CRow>
        <ErrorModal />
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Input new post</strong>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-1">
                <CCol xs={3}>
                  <div className="p-2 border bg-light">Pilih KOL</div>
                </CCol>
                <CCol xs={9}>
                  <CFormSelect
                    aria-label="Large select example"
                    onChange={(e) => {
                      // console.log(e.target.value)
                      // setKontrakKol(e.target.value)
                      handleSelectedKol(e.target.value)
                      // if (e.target.value === 'Manual') {
                      //   setHideInputManual(false)
                      // } else {
                      //   setHideInputManual(true)
                      // }
                    }}
                  >
                    <option value="default">Pilih KOL</option>
                    {kolList != null &&
                      kolList.map((value, index) => (
                        <option key={value['Kontrak Id']} value={index}>
                          {value['Kontrak Name']}
                        </option>
                      ))}
                  </CFormSelect>
                </CCol>
              </CRow>
              {kolDetail != null && kolDetail.USERNAME != null && (
                <CRow className="mb-1">
                  <CCol xs={3}>
                    <div className="p-2 border bg-light">Username</div>
                  </CCol>
                  <CCol xs={9}>
                    <div className="p-2 border bg-light">{kolDetail.USERNAME}</div>
                  </CCol>
                </CRow>
              )}
              {kolDetail != null && kolDetail.PLATFORM != null && (
                <CRow className="mb-1">
                  <CCol xs={3}>
                    <div className="p-2 border bg-light">Platform</div>
                  </CCol>
                  <CCol xs={9}>
                    <div className="p-2 border bg-light">{kolDetail.PLATFORM}</div>
                  </CCol>
                </CRow>
              )}
              {kolDetail != null && kolDetail.NAME != null && (
                <CRow className="mb-1">
                  <CCol xs={3}>
                    <div className="p-2 border bg-light">Nama</div>
                  </CCol>
                  <CCol xs={9}>
                    <div className="p-2 border bg-light">{kolDetail.NAME}</div>
                  </CCol>
                </CRow>
              )}
              <CRow className="mb-1">
                <CCol xs={3}>
                  <div className="p-2 border bg-light">Pilih Manager KOL</div>
                </CCol>
                <CCol xs={9}>
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
              <CRow className="mb-1">
                <CCol xs={3}>
                  <div className="p-2 border bg-light">Pilih Brief</div>
                </CCol>
                <CCol xs={9}>
                  <CFormSelect
                    aria-label="Large select example"
                    onChange={(e) => {
                      setBriefCode(e.target.value)
                      // if (e.target.value === 'Manual') {
                      //   setHideInputManual(false)
                      // } else {
                      //   setHideInputManual(true)
                      // }
                    }}
                  >
                    <option value="default">Pilih Brief</option>
                    {briefCodeList != null &&
                      briefCodeList.map((value, index) => (
                        <option key={index} value={value['Brief Id']}>
                          {value['Brief Code']}
                        </option>
                      ))}
                  </CFormSelect>
                </CCol>
              </CRow>
              {/* {kolDetail != null && kolDetail.PLATFORM != null && kolDetail.PLATFORM == 'Tiktok' && (
                <CRow className="mb-1">
                  <CCol xs={3}>
                    <div className="p-2 border bg-light">Pilih Product Attached</div>
                  </CCol>
                  <CCol xs={9}>
                    <CFormSelect
                      aria-label="Large select example"
                      onChange={(e) => {
                        setProductAttached(e.target.value)
                        // if (e.target.value === 'Manual') {
                        //   setHideInputManual(false)
                        // } else {
                        //   setHideInputManual(true)
                        // }
                      }}
                    >
                      <option value="default">Pilih product attached keranjang kuning</option>
                      {productList != null &&
                        productList.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                    </CFormSelect>
                  </CCol>
                </CRow>
              )} */}
              <CRow className="mb-1">
                <CCol xs={3}>
                  <div className="p-2 border bg-light">Link Post</div>
                </CCol>
                <CCol xs={9}>
                  <GeneralFormInput
                    // autoFocus="autofocus"
                    type="text"
                    placeholder="input link post" //"Input uername KOL"
                    value={linkPost}
                    onChange={(event) => {
                      setLinkPost(event.target.value)
                    }}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-1">
                <CCol xs={3}>
                  <div className="p-2 border bg-light">Tanggal up sesuai kontrak</div>
                </CCol>
                <CCol xs={9}>
                  <div className="p-2 border bg-light">
                    <DatePicker
                      className="border bg-light"
                      selected={tanggalUpKontrak}
                      onChange={(date: Date) => setTanggalUpKontrak(date)}
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
                  onClick={handleOnSubmit}
                >
                  Submit
                </CButton>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </Suspense>
  )
}

export default InputNewPost
