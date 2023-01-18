import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CFormSelect } from '@coreui/react'
import { GeneralFormInput, GeneralTextArea } from '../../../utils/GeneralFormInput'
import { insertNewBrief, insertNewManager } from '../../../utils/request-marketing'

const InputNewManager = () => {
  const [managerName, setManagerName] = useState('')
  const [noWhatsApp, setNoWhatsApp] = useState('')
  const [noKTP, setNoKTP] = useState('')
  const [email, setEmail] = useState('')
  const [alias, setAlias] = useState('')
  const [roles, setRoles] = useState('default')
  const [show, setShow] = useState(false)
  const [errMessage, setErrorMessage] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [listRoles, setListRoles] = useState(['Social Media Specialist'])
  const resetAllVariable = () => {
    setManagerName('')
    setNoWhatsApp('')
    setEmail('')
    setAlias('')
    setNoKTP('')
    setRoles('default')
  }

  const handleOnSumbit = () => {
    if (managerName == '') {
      setErrorMessage('Please input manager name')
      setModalTitle('Submit Error')
      handleShow()
    } else if (alias == '') {
      setErrorMessage('Please input manager alias')
      setModalTitle('Submit Error')
      handleShow()
    } else if (roles == 'default') {
      setErrorMessage('Please select roles')
      setModalTitle('Submit Error')
      handleShow()
    } else if (noWhatsApp == '') {
      setErrorMessage('Please input manager whatsapp number')
      setModalTitle('Submit Error')
      handleShow()
    } else if (noKTP == '') {
      setErrorMessage('Please input NIK number')
      setModalTitle('Submit Error')
      handleShow()
    } else if (email == '') {
      setErrorMessage('Please input manager email')
      setModalTitle('Submit Error')
      handleShow()
    } else {
      try {
        let user = sessionStorage.getItem('user')
        let resInsertNewManager = insertNewManager(
          managerName,
          noWhatsApp,
          email,
          alias,
          roles,
          noKTP,
          user,
        )
        resInsertNewManager.then(function (result) {
          if (result.status === 'true') {
            setModalTitle('Submit Success')
            setErrorMessage('Insert new manager success')
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
            <strong>Input new Manager</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-1">
              <CCol xs={2}>
                <div className="p-2 border bg-light">Manager Name</div>
              </CCol>
              <CCol xs={10}>
                <GeneralFormInput
                  // autoFocus="autofocus"
                  type="text"
                  placeholder="input manager name" //"Input uername KOL"
                  value={managerName}
                  onChange={(event) => {
                    setManagerName(event.target.value)
                  }}
                />
              </CCol>
            </CRow>
            <CRow className="mb-1">
              <CCol xs={2}>
                <div className="p-2 border bg-light">Manager Alias</div>
              </CCol>
              <CCol xs={10}>
                <GeneralFormInput
                  // autoFocus="autofocus"
                  type="text"
                  placeholder="input alias (only 1 word, cannot separated by spaces)" //"Input uername KOL"
                  value={alias}
                  onChange={(event) => {
                    setAlias(event.target.value)
                  }}
                />
              </CCol>
            </CRow>
            <CRow className="mb-1">
              <CCol xs={2}>
                <div className="p-2 border bg-light">Roles</div>
              </CCol>
              <CCol xs={10}>
                <CFormSelect
                  aria-label="Large select example"
                  onChange={(e) => {
                    setRoles(e.target.value)
                  }}
                >
                  <option value="default">Pilih Roles</option>
                  {listRoles.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mb-1">
              <CCol xs={2}>
                <div className="p-2 border bg-light">No. Whatsapp</div>
              </CCol>
              <CCol xs={10}>
                <GeneralFormInput
                  // autoFocus="autofocus"
                  type="text"
                  placeholder="input manager No. whatsapp" //"Input uername KOL"
                  value={noWhatsApp}
                  onChange={(event) => {
                    setNoWhatsApp(event.target.value)
                  }}
                  regexInput={/^[0-9\b]+$/}
                />
              </CCol>
            </CRow>
            <CRow className="mb-1">
              <CCol xs={2}>
                <div className="p-2 border bg-light">NIK</div>
              </CCol>
              <CCol xs={10}>
                <GeneralFormInput
                  // autoFocus="autofocus"
                  type="text"
                  placeholder="input manager NIK" //"Input uername KOL"
                  value={noKTP}
                  onChange={(event) => {
                    setNoKTP(event.target.value)
                  }}
                  regexInput={/^[0-9\b]+$/}
                />
              </CCol>
            </CRow>
            <CRow className="mb-1">
              <CCol xs={2}>
                <div className="p-2 border bg-light">Email</div>
              </CCol>
              <CCol xs={10}>
                <GeneralFormInput
                  // autoFocus="autofocus"
                  type="text"
                  placeholder="input manager email" //"Input uername KOL"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                  }}
                />
              </CCol>
            </CRow>
            <CRow className="mt-4">
              <CButton
                color="secondary"
                active={'active' === 'active'}
                variant="outline"
                key="1"
                onClick={handleOnSumbit}
              >
                Submit
              </CButton>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default InputNewManager
