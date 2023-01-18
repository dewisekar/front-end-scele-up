import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CAlert } from '@coreui/react'
import { MDBDataTable, MDBTableHead, MDBTableBody } from 'mdbreact'

import { execSPWithoutInput, getFormatList } from '../../../utils/request-marketing'
import { NavLink } from 'react-router-dom'
import { LoadingAnimation, NoDataAvailable } from '../../../components'
import { getPostStatus, convertDate } from 'src/utils/pageUtil'
import { StoredProcedure, PostStatus } from 'src/constants'

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
            const status = PostStatus[postStatus]

            const action = (
              <>
                <NavLink
                  to={'/MaintainKol/ViewPost?Id=' + item.Id}
                  className="btn btn-dark btn-sm"
                  style={{ marginRight: '8px' }}
                >
                  View
                </NavLink>
                {!uploadDate && (
                  <NavLink
                    to={'/MaintainKol/UpdatePost?Id=' + item.Id}
                    className="btn btn-secondary btn-sm"
                  >
                    Update
                  </NavLink>
                )}
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
            <CCardBody>
              <CAlert color="info">
                Demi kelancaran pengumpulan data statistik, jangan lupa untuk update data post
                setelah KOL melakukan <i>upload</i> di sosial media,{' '}
                <b>maksimal H+1 waktu KOL upload post.</b>
              </CAlert>
              {formatTable && <DatatablePage data={dataTable} />}
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
