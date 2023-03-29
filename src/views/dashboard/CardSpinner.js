import React from 'react'
import { CSpinner, CCard } from '@coreui/react'

const CardSpinner = () => {
  const renderSpinner = () => {
    return (
      <CCard className="px-5 py-3" style={{ alignItems: 'center', display: 'flex' }}>
        <CSpinner color="secondary" />
      </CCard>
    )
  }

  return renderSpinner()
}

export default CardSpinner
