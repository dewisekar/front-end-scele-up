import React from 'react'
import { CBadge } from '@coreui/react'

const StatusBadge = ({ enumType, content }) => {
  return (
    <CBadge color={enumType[content]} shape="rounded-pill">
      {content}
    </CBadge>
  )
}

export default React.memo(StatusBadge)
