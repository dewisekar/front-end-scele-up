import React from 'react'
import { CCol, CRow } from '@coreui/react'
import { ColumnSizePercentage } from 'src/constants'

const VerticalTableRow = ({ props }) => {
  const {
    data,
    item: { label, field, type = 'text' },
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
      overflowWrap: 'break-word',
      wordBreak: 'break-all',
    },
  }

  const renderFullRow = () => {
    return (
      <CRow className="mb-1" style={styles.contentColumn}>
        <CCol xs={3}>
          <div className="p-2 border bg-light">{label}</div>
        </CCol>
        <CCol xs={9} style={styles.contentColumn}>
          <div className="p-2 border" style={styles.contentContainer}>
            {type === 'link' ? (
              <a href={value} target="_blank" rel="noreferrer">
                {value}
              </a>
            ) : (
              value
            )}
          </div>
        </CCol>
      </CRow>
    )
  }

  const renderHalfRow = () => {
    return (
      <>
        <CCol xs={2} className="mb-1" style={styles.contentColumn}>
          <div className="p-2 border bg-light">{label}</div>
        </CCol>
        <CCol xs={4} className="mb-1" style={styles.contentColumn}>
          <div className="p-2 border" style={styles.contentContainer}>
            {type === 'link' ? (
              <a href={value} target="_blank" rel="noreferrer">
                {value}
              </a>
            ) : (
              value
            )}
          </div>
        </CCol>
      </>
    )
  }

  return <>{size === ColumnSizePercentage.FULL ? renderFullRow() : renderHalfRow()}</>
}

export default React.memo(VerticalTableRow)
