import React, { useEffect, useState, Suspense } from 'react'
import { Modal } from 'react-bootstrap'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CFormInput } from '@coreui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { convertDataToSelectOptions } from '../../utils/GeneralFormInput'
import Select from 'react-select'
import { getRequestByUri, insertNewPost } from '../../utils/request-marketing'
import { LoadingAnimation } from 'src/components'

const findKolIdByKontrakId = (kontrakList, KontrakId) => {
  let foundArr = kontrakList.filter((item) => item['Kontrak Id'] == KontrakId)
  if (foundArr.length > 0) {
    return foundArr[0]['Kol Id']
  } else {
    return null
  }
}
const InputNewPost = () => {
  const [state, setState] = useState({})
  const today = new Date()
  const [tanggalUpKontrak, setTanggalUpKontrak] = useState(today)
  const [kontrakKol, setKontrakKol] = useState(null)
  const [managerKol, setManagerKol] = useState(null)
  const [briefCode, setBriefCode] = useState(null)
  const [totalAmountOfSlot, setTotalAmountOfSlot] = useState(0)
  const [numberOfSlot, setNumberOfSlot] = useState(0)
  const errorTitle = 'Submit Error'
  const errorMessage = `Please select / fill `

  const [kolList, setKolList] = useState(null)
  const [managerList, setManagerList] = useState(null)
  const [briefCodeList, setBriefCodeList] = useState(null)
  const [kolDetail, setKolDetail] = useState(null)

  const [show, setShow] = useState(false)
  const [errMessage, setErrorMessage] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [isLoading, setIsLoading] = useState(true)

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
        setIsLoading(false)
      })
    } catch (err) {
      console.log(err)
    }
    return () => {
      setState({}) // This worked for me
    }
  }, [])

  const handleResetForm = () => {
    setKontrakKol(null)
    setManagerKol(null)
    setBriefCode(null)
    setKolDetail(null)
    setTanggalUpKontrak(today)
    setNumberOfSlot(0)
    setTotalAmountOfSlot(0)
  }

  const checkAllFieldsFilled = (fields) => {
    const result = fields.filter((field) => field.value === null || field.value === 0)
    return result
  }

  const handleOnSubmit = () => {
    const fields = [
      { value: kontrakKol, fieldName: 'KOL' },
      { value: managerKol, fieldName: 'Manager KOL' },
      { value: briefCode, fieldName: 'Brief Code' },
      { value: tanggalUpKontrak },
    ]
    const checker = checkAllFieldsFilled(fields)
    const isReadyToSubmit = checker.length === 0

    if (!isReadyToSubmit) {
      const [{ fieldName }] = checker
      setErrorMessage(errorMessage + fieldName)
      setModalTitle(errorTitle)
      handleShow()
      return
    }

    let user = sessionStorage.getItem('user')
    const payload = {
      KontrakId: kontrakKol.value,
      ManagerId: managerKol.value,
      BriefId: briefCode.value,
      TglPostKontrak: tanggalUpKontrak,
      User: user,
    }
    console.log('ini payload', payload)
    let resInsertNewPost = insertNewPost(payload)
    try {
      resInsertNewPost.then(function (result) {
        console.log('resInsertNewPost:', result.status)
        if (result.status === 'true') {
          setModalTitle('Submit Success')
          setErrorMessage('Insert new post success, Post Id : ' + result.postId)
          handleShow()
          console.log('success')
          handleResetForm()
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleSelectedKol = (Id) => {
    if (Id != null) {
      setIsLoading(true)
      let kolId = findKolIdByKontrakId(kolList, Id)
      if (kolId != null) {
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

        const resGetKontrakDetail = getRequestByUri('/getKontrakDetail?Id=' + Id.toString())
        try {
          resGetKontrakDetail.then(function (result) {
            console.log('resGetKontrakDetail:', result.status)
            if (result.status === 'true') {
              const { message } = result
              const totalSlot = message['Booking Slot']
              const postNumber = message['postNumber']
              setTotalAmountOfSlot(totalSlot)
              setNumberOfSlot(postNumber)
            }
          })
        } catch (err) {
          console.log(err)
        }
      } else {
        console.log('Warning kolId is null')
      }
      setIsLoading(false)
    } else {
      console.log('Warning id is null')
    }
  }

  const renderKolDropdown = () => {
    return (
      <CRow className="mb-1">
        <CCol xs={3}>
          <div className="p-2 border bg-light">
            Pilih KOL <br></br>
            <small className="text-info">Nama KOL - Platform - Kontrak Ke</small>
          </div>
        </CCol>
        <CCol xs={9}>
          <Select
            options={convertDataToSelectOptions(kolList, 'Kontrak Id', 'Kontrak Name')}
            placeholder="Pilih KOL"
            value={kontrakKol}
            isClearable={true}
            onChange={(e) => {
              setKontrakKol(e)
              if (e != null) {
                handleSelectedKol(e.value)
              } else {
                setKolDetail(null)
              }
            }}
          />
        </CCol>
      </CRow>
    )
  }

  const renderKolUsername = () => {
    return (
      <CRow className="mb-1">
        <CCol xs={3}>
          <div className="p-2 border bg-light">Username</div>
        </CCol>
        <CCol xs={9}>
          <div className="p-2 border bg-light">{kolDetail.USERNAME}</div>
        </CCol>
      </CRow>
    )
  }

  const renderKolPlatform = () => {
    return (
      <CRow className="mb-1">
        <CCol xs={3}>
          <div className="p-2 border bg-light">Platform</div>
        </CCol>
        <CCol xs={9}>
          <div className="p-2 border bg-light">{kolDetail.PLATFORM}</div>
        </CCol>
      </CRow>
    )
  }

  const renderKolName = () => {
    return (
      <CRow className="mb-1">
        <CCol xs={3}>
          <div className="p-2 border bg-light">Nama</div>
        </CCol>
        <CCol xs={9}>
          <div className="p-2 border bg-light">{kolDetail.NAME}</div>
        </CCol>
      </CRow>
    )
  }

  const renderChosenKolDetail = () => {
    return (
      <>
        {renderKolUsername()}
        {renderKolPlatform()}
        {renderKolName()}
      </>
    )
  }

  const renderManager = () => {
    return (
      <CRow className="mb-1">
        <CCol xs={3}>
          <div className="p-2 border bg-light">Pilih Manager KOL</div>
        </CCol>
        <CCol xs={9}>
          <Select
            options={convertDataToSelectOptions(managerList, 'Manager Id', 'Manager Name')}
            placeholder="Pilih Manager"
            value={managerKol}
            onChange={(e) => {
              // console.log(e)
              setManagerKol(e)
            }}
          />
        </CCol>
      </CRow>
    )
  }

  const renderBriefCode = () => {
    return (
      <CRow className="mb-1">
        <CCol xs={3}>
          <div className="p-2 border bg-light">Pilih Brief</div>
        </CCol>
        <CCol xs={9}>
          <Select
            options={convertDataToSelectOptions(briefCodeList, 'Brief Id', 'Brief Code Tema')}
            placeholder="Pilih Brief"
            value={briefCode}
            onChange={(e) => {
              // console.log(e)
              setBriefCode(e)
            }}
          />
        </CCol>
      </CRow>
    )
  }

  const renderNumberOfSlot = () => {
    return (
      <CRow className="mb-1">
        <CCol xs={3}>
          <div className="p-2 border bg-light">Slot Ke / Total Slot</div>
        </CCol>
        <CCol xs={1}>
          <CFormInput value={numberOfSlot} disabled />
        </CCol>
        <div className="text-center pl-0 pr-0 pt-2 pb-2" style={{ width: '30px' }}>
          /
        </div>
        <CCol xs={1}>
          <CFormInput value={totalAmountOfSlot} disabled />
        </CCol>
      </CRow>
    )
  }

  const renderPostDate = () => {
    return (
      <CRow className="mb-1">
        <CCol xs={3}>
          <div className="p-2 border bg-light">Tanggal up sesuai kontrak</div>
        </CCol>
        <CCol xs={9}>
          <div>
            <DatePicker
              selected={tanggalUpKontrak}
              onChange={(date: Date) => setTanggalUpKontrak(date)}
            />
          </div>
        </CCol>
      </CRow>
    )
  }

  const renderSubmitButton = () => {
    return (
      <CRow className="mt-4">
        <CCol xs={10}>
          <CButton
            color="info"
            active={'active' === 'active'}
            variant="outline"
            key="1"
            className="w-100"
            onClick={handleOnSubmit}
          >
            Submit
          </CButton>
        </CCol>
        <CCol xs={2}>
          <CButton
            color="secondary"
            active={'active' === 'active'}
            variant="outline"
            key="1"
            onClick={handleResetForm}
            className="w-100"
          >
            Reset
          </CButton>
        </CCol>
      </CRow>
    )
  }

  const renderForm = () => {
    return (
      <CCardBody>
        {kolList && renderKolDropdown()}
        {kolDetail && renderChosenKolDetail()}
        {managerList && renderManager()}
        {briefCodeList && renderBriefCode()}
        {renderNumberOfSlot()}
        {renderPostDate()}
        {renderSubmitButton()}
      </CCardBody>
    )
  }

  const renderLoadingAnimation = () => {
    return <LoadingAnimation />
  }

  const renderContent = () => {
    return (
      <Suspense>
        <CRow>
          <ErrorModal />
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Input New Post Plan</strong>
              </CCardHeader>
              {renderForm()}
            </CCard>
          </CCol>
        </CRow>
      </Suspense>
    )
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

  return <>{isLoading ? renderLoadingAnimation() : renderContent()}</>
}

export default InputNewPost
