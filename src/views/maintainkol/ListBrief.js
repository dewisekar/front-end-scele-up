import React, { useState, useEffect, Suspense } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CBadge,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CFormSelect,
} from '@coreui/react'
import { MDBDataTable, MDBTableHead, MDBTableBody } from 'mdbreact'
import { getRequestByUri } from '../../utils/request-marketing'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const ListBrief = () => {
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
      })
    } catch (err) {
      console.log(err)
    }
  }, [])

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
        <div className="text-danger">
          <h6>Can not find format</h6>
        </div>
      )
    }
  }
  const [formatTable, setFormatTable] = useState(null)
  const [dataTable, setDataTable] = useState(null)

  return (
    <Suspense fallback={loading}>
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
    </Suspense>
  )
}

export default ListBrief
