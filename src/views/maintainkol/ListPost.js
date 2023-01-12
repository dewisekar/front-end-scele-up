import React, { useState, useEffect, Suspense } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CBadge } from '@coreui/react'
import { MDBDataTable, MDBTableHead, MDBTableBody } from 'mdbreact'

import { execSPWithoutInput, getFormatList } from '../../utils/request-marketing'
import { NavLink } from 'react-router-dom'
import { LoadingAnimation, NoDataAvailable } from '../../components'
import { getPostStatus, convertDate } from 'src/utils/pageUtil'
import { StoredProcedure } from 'src/constants'

const ListPost = () => {
  const [formatTable, setFormatTable] = useState(null)
  const [dataTable, setDataTable] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const StatusAction = {
    FULFILLED: <CBadge color="success">FULFILLED</CBadge>,
    ONSCHEDULE: <CBadge color="warning">ON SCHEDULE</CBadge>,
    MISSED: <CBadge color="danger">MISSED</CBadge>,
  }

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

    let resGetListPost = execSPWithoutInput(StoredProcedure.GET_ALL_POST)
    try {
      resGetListPost.then(function (result) {
        if (result.status === 'true') {
          let listPosData = result.message

          listPosData = listPosData.map((item) => {
            const { deadlinePost, uploadDate } = item
            const convertedDeadlineDate = new Date(deadlinePost)
            const convertedUploadDate = uploadDate ? new Date(uploadDate) : null

            const postStatus = getPostStatus(convertedDeadlineDate, convertedUploadDate)
            const status = StatusAction[postStatus]

            const action = (
              <>
                <NavLink
                  to={'/MaintainKol/ViewPost?Id=' + item.Id}
                  className="btn btn-success btn-sm"
                  style={{ marginRight: '8px' }}
                >
                  View
                </NavLink>
                <NavLink to={'/MaintainKol/ViewPost?Id=' + item.Id} className="btn btn-info btn-sm">
                  Update
                </NavLink>
              </>
            )

            return {
              ...item,
              deadlinePost: convertDate(deadlinePost),
              action,
              status,
            }
          })
          setDataTable(listPosData)
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
              <strong>List Post</strong> {/*<small>File input</small>*/}
            </CCardHeader>
            <CCardBody>{formatTable && <DatatablePage data={dataTable} />}</CCardBody>
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
      return (
        <MDBDataTable striped bordered data={dataInput}>
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
