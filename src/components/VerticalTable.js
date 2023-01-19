import React from 'react'
import { CTable, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react'

const VerticalTable = ({ fields, data }) => {
  const renderBriefInfo = (fields, data) => {
    const info = fields.map((item, index) => {
      return (
        <CTableRow key={item.key}>
          <CTableHeaderCell>{item.label}</CTableHeaderCell>
          <CTableDataCell>{data[item.key]}</CTableDataCell>
        </CTableRow>
      )
    })

    return info
  }

  return (
    <CTable bordered>
      <CTableBody>{renderBriefInfo(fields, data)}</CTableBody>
    </CTable>
  )
}

export default React.memo(VerticalTable)
