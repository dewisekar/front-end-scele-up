import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { MDBDataTable } from 'mdbreact'
import { getFormatListKol, getListKol } from '../../utils/request-marketing'
import { LoadingAnimation } from 'src/components'

const ListKol = () => {
  const [formatTable, setFormatTable] = useState(null)
  const [dataTable, setDataTable] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let resGetFormatListKol = getFormatListKol()
    try {
      resGetFormatListKol.then(function (result) {
        console.log('resGetFormatListKol:', result.status)
        if (result.status === 'true') {
          setFormatTable(result.message)
        }
      })
    } catch (err) {
      console.log(err)
    }

    let resGetListKol = getListKol()
    try {
      resGetListKol.then(function (result) {
        console.log('resGetListKol:', result.status)
        if (result.status === 'true') {
          setDataTable(result.message)
          setIsLoading(false)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }, [])

  const renderLoadingAnimation = () => {
    return (
      <CRow>
        <LoadingAnimation />
      </CRow>
    )
  }

  const renderContent = () => {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>List Kol</strong> {/*<small>File input</small>*/}
            </CCardHeader>
            <CCardBody>
              <DatatablePage data={dataTable} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  const DatatablePage = (props) => {
    if (formatTable != null) {
      let dataInput = {
        columns: formatTable,
        rows: props.data,
      }
      console.log(formatTable)
      return (
        <MDBDataTable scrollX striped bordered data={dataInput}>
          {/* <MDBTableHead columns={dataInput.columns} />
          <MDBTableBody rows={dataInput.rows} /> */}
        </MDBDataTable>
      )
    } else {
      return (
        <div className="text-center">
          <h6>No data available</h6>
        </div>
      )
    }
  }

  return <>{isLoading ? renderLoadingAnimation() : renderContent()}</>
}

export default ListKol
