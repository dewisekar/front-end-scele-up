import React from 'react'
import { CCol, CRow } from '@coreui/react'
import { ColumnSizePercentage } from 'src/constants'
const VerticalTableRow = ({ props }) => {
  const {
    data,
    item: { label, field },
    size = ColumnSizePercentage.FULL,
  } = props

  const styles = {
    container: {
      backgroundColor: '#7B84A1',
      borderRadius: '13px',
    },
    link: {
      textDecoration: 'none',
      fontWeight: '600',
    },
  }

  const renderFullRow = () => {
    return (
      <CRow className="mb-1">
        <CCol xs={3}>
          <div className="p-2 border bg-light">{label}</div>
        </CCol>
        {field && (
          <CCol xs={9}>
            <div className="p-2 border bg-light">{field}</div>
          </CCol>
        )}
      </CRow>
    )
  }

  const renderHalfRow = () => {
    return (
      <>
        <CCol xs={2} className="mb-1">
          <div className="p-2 border bg-light">{label}</div>
        </CCol>
        {field && (
          <CCol xs={4} className="mb-1">
            <div className="p-2 border bg-light">{field}</div>
          </CCol>
        )}
      </>
    )
  }

  return <>{size === ColumnSizePercentage.FULL ? renderFullRow() : renderHalfRow()}</>
}

export default React.memo(VerticalTableRow)
