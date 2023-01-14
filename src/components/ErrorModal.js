import React from 'react'
import { CModal, CModalBody, CModalTitle, CModalHeader, CModalFooter, CButton } from '@coreui/react'

const ErrorModal = ({ isVisible, onClose, modalMessage }) => {
  const { title, message } = modalMessage

  return (
    <CModal alignment="center" visible={isVisible} onClose={() => onClose()}>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{message}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => onClose()}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default React.memo(ErrorModal)
