import React from 'react'
import { CCol, CRow } from '@coreui/react'
import { ColumnSizePercentage } from 'src/constants'
import { grid2Classes } from '@mui/material'
const VerticalTableRow = ({ props }) => {
  const {
    data,
    item: { label, field },
    size = ColumnSizePercentage.FULL,
  } = props
  const value = data[field]

  const styles = {
    contentContainer: {
      backgroundColor: '#f7f7f5',
    },
    link: {
      textDecoration: 'none',
      fontWeight: '600',
    },
    contentColumn: {
      display: 'grid',
      alignItems: 'stretch',
    },
  }

  const renderFullRow = () => {
    return (
      <CRow className="mb-1">
        <CCol xs={3}>
          <div className="p-2 border bg-light">{label}</div>
        </CCol>
        <CCol xs={9} style={styles.contentColumn}>
          <div className="p-2 border" style={styles.contentContainer}>
            {value}
          </div>
        </CCol>
      </CRow>
    )
  }

  const renderHalfRow = () => {
    return (
      <>
        <CCol xs={2} className="mb-1">
          <div className="p-2 border bg-light">{label}</div>
        </CCol>
        <CCol xs={4} className="mb-1" style={styles.contentColumn}>
          <div className="p-2 border" style={styles.contentContainer}>
            {value}
          </div>
        </CCol>
      </>
    )
  }

  return <>{size === ColumnSizePercentage.FULL ? renderFullRow() : renderHalfRow()}</>
}

export default React.memo(VerticalTableRow)
