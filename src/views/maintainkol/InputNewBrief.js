import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CFormSelect } from '@coreui/react'
import { GeneralFormInput, GeneralTextArea } from '../../utils/GeneralFormInput'
import { insertNewBrief } from '../../utils/request-marketing'

const InputNewBrief = () => {
  const [tema, setTema] = useState('')
  const [konsep, setKonsep] = useState('')
  const [script, setScript] = useState('')
  const [refLink, setRefLink] = useState('')
  const [show, setShow] = useState(false)
  const [errMessage, setErrorMessage] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const resetAllVariable = () => {
    setTema('')
    setKonsep('')
    setScript('')
    setRefLink('')
  }

  const handleOnSumbit = () => {
    if (tema == '') {
      setErrorMessage('Please input tema')
      setModalTitle('Submit Error')
      handleShow()
    } else if (konsep == '') {
      setErrorMessage('Please input konsep')
      setModalTitle('Submit Error')
      handleShow()
    } else if (script == '') {
      setErrorMessage('Please input script')
      setModalTitle('Submit Error')
      handleShow()
    } else if (refLink == '') {
      setErrorMessage('Please input link referensi video')
      setModalTitle('Submit Error')
      handleShow()
    } else {
      try {
        let user = sessionStorage.getItem('user')
        let resInsertNewBrief = insertNewBrief(tema, konsep, script, refLink, user)
        resInsertNewBrief.then(function (result) {
          if (result.status === 'true') {
            setModalTitle('Submit Success')
            setErrorMessage('Insert new brief success, Brief Code : ' + result.briefCode)
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
            <strong>Input new Brief</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-1">
              <CCol xs={2}>
                <div className="p-2 border bg-light">Tema</div>
              </CCol>
              <CCol xs={10}>
                <GeneralFormInput
                  // autoFocus="autofocus"
                  type="text"
                  placeholder="input tema" //"Input uername KOL"
                  value={tema}
                  onChange={(event) => {
                    setTema(event.target.value)
                  }}
                />
              </CCol>
            </CRow>
            <CRow className="mb-1">
              <CCol xs={2}>
                <div className="p-2 border bg-light">Konsep</div>
              </CCol>
              <CCol xs={10}>
                <GeneralTextArea
                  // autoFocus="autofocus"
                  text={''}
                  placeholder="input konsep" //"Input uername KOL"
                  value={konsep}
                  onChange={(event) => {
                    setKonsep(event.target.value)
                  }}
                />
              </CCol>
            </CRow>
            <CRow className="mb-1">
              <CCol xs={2}>
                <div className="p-2 border bg-light">Script</div>
              </CCol>
              <CCol xs={10}>
                <GeneralTextArea
                  // autoFocus="autofocus"
                  text={''}
                  placeholder="input script" //"Input uername KOL"
                  value={script}
                  onChange={(event) => {
                    setScript(event.target.value)
                  }}
                />
              </CCol>
            </CRow>
            <CRow className="mb-1">
              <CCol xs={2}>
                <div className="p-2 border bg-light">Link Referensi Video</div>
              </CCol>
              <CCol xs={10}>
                <GeneralTextArea
                  // autoFocus="autofocus"
                  text={''}
                  placeholder="input link referensi video" //"Input uername KOL"
                  value={refLink}
                  onChange={(event) => {
                    setRefLink(event.target.value)
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

export default InputNewBrief
