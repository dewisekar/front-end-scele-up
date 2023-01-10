import React, { useState, useEffect, Suspense } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { MDBDataTable, MDBTableHead, MDBTableBody } from 'mdbreact'
import { getRequestByUri } from '../../utils/request-marketing'
import { LoadingAnimation, NoDataAvailable } from 'src/components'

const ListBrief = () => {
  const [formatTable, setFormatTable] = useState(null)
  const [dataTable, setDataTable] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let resGetFormatListBrief = getRequestByUri('/getFormatListBrief')
    try {
      resGetFormatListBrief.then(function (result) {
        console.log('getFormatListBrief:', result.status)
        if (result.status === 'true') {
          setFormatTable(result.message)
        }
      })
    } catch (err) {
      console.log(err)
    }

    let resGetListBrief = getRequestByUri('/getListBrief')
    try {
      resGetListBrief.then(function (result) {
        console.log('resGetListBrief:', result.status)
        if (result.status === 'true') {
          setDataTable(result.message)
        }
        setIsLoading(false)
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
              <strong>List Brief</strong> {/*<small>File input</small>*/}
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
    }
    return <NoDataAvailable />
  }

  return <> {isLoading ? renderLoadingAnimation() : renderContent()}</>
}

export default ListBrief
