import React, { useState, useEffect, Suspense } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { MDBDataTable, MDBTableHead, MDBTableBody } from 'mdbreact'
import { getRequestByUri } from '../../utils/request-marketing'
import { LoadingAnimation } from '../../components'

const ListKontrak = () => {
  const [formatTable, setFormatTable] = useState(null)
  const [dataTable, setDataTable] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let resGetFormatListKontrak = getRequestByUri('/getFormatListKontrak')
    try {
      resGetFormatListKontrak.then(function (result) {
        console.log('resGetFormatListKontrak:', result.status)
        if (result.status === 'true') {
          setFormatTable(result.message)
        }
      })
    } catch (err) {
      console.log(err)
    }

    let resGetListKontrak = getRequestByUri('/getListKontrak')
    try {
      resGetListKontrak.then(function (result) {
        console.log('resGetListKontrak:', result.status)
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

  const renderTable = () => {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>List Kontrak</strong> {/*<small>File input</small>*/}
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
          <MDBTableHead columns={dataInput.columns} />
          <MDBTableBody rows={dataInput.rows} />
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

  return <>{isLoading ? renderLoadingAnimation() : renderTable()}</>
}

export default ListKontrak
