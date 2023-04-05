import React from 'react'
import { CModal, CModalBody, CModalTitle, CModalHeader, CModalFooter, CButton } from '@coreui/react'

const ConfirmationModal = ({
  isVisible,
  onClose,
  modalMessage,
  confirmButtonLabel,
  onConfirm,
  isDisabled = false,
}) => {
  const { title, message } = modalMessage

  return (
    <CModal alignment="center" visible={isVisible} onClose={() => onClose()}>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{message}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => onClose()} disabled={isDisabled}>
          Batal
        </CButton>
        <CButton color="primary" onClick={() => onConfirm()} disabled={isDisabled}>
          {confirmButtonLabel}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default React.memo(ConfirmationModal)
