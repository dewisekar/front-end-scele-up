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
import { execSPWithoutInput, getFormatList } from '../../utils/request-marketing'
import { NavLink, useLocation } from 'react-router-dom'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const ListPost = () => {
  useEffect(() => {
    let resGetFormatListPost = getFormatList('post')
    try {
      resGetFormatListPost.then(function (result) {
        console.log('getFormatListPost:', result.status)
        if (result.status === 'true') {
          setFormatTable(result.message)
        }
      })
    } catch (err) {
      console.log(err)
    }

    let resGetListPost = execSPWithoutInput('[MARKETING].[dbo].[SP_GetListPostForView]')
    try {
      resGetListPost.then(function (result) {
        console.log('resGetListPost:', result.status)
        if (result.status === 'true') {
          let listPosData = result.message
          listPosData = listPosData.map((item) => ({
            ...item,
            action: (
              <NavLink
                to={'/MaintainKol/ViewPost?Id=' + item.Id}
                className="btn btn-success btn-sm"
              >
                View
              </NavLink>
            ),
          }))
          setDataTable(listPosData)
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
              <strong>List Post</strong> {/*<small>File input</small>*/}
            </CCardHeader>
            <CCardBody>{formatTable && dataTable && <DatatablePage data={dataTable} />}</CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </Suspense>
  )
}

export default ListPost
