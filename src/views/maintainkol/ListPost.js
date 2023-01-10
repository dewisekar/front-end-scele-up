import React, { useState, useEffect, Suspense } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { MDBDataTable, MDBTableHead, MDBTableBody } from 'mdbreact'
import { execSPWithoutInput, getFormatList } from '../../utils/request-marketing'
import { NavLink, useLocation } from 'react-router-dom'
import { LoadingAnimation, NoDataAvailable } from '../../components'

const ListPost = () => {
  const [formatTable, setFormatTable] = useState(null)
  const [dataTable, setDataTable] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

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
              <strong>List Post</strong> {/*<small>File input</small>*/}
            </CCardHeader>
            <CCardBody>{formatTable && dataTable && <DatatablePage data={dataTable} />}</CCardBody>
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

  return <>{isLoading ? renderLoadingAnimation() : renderContent()}</>
}

export default ListPost
