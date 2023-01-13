import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
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
import {
  execSPWithoutInput,
  execSPWithInput,
  updatePostStatsById,
} from '../../utils/request-marketing'
import { StoredProcedure } from 'src/constants'
import { tableField, styles } from './ViewPost.config'
import { getRequestByUri } from '../../utils/request-marketing'
import { URL } from 'src/constants'

const ViewPost = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [postId, setPostId] = useState(null)
  const [postDetail, setPostDetail] = useState(null)

  useEffect(() => {
    try {
      let postId = searchParams.get('Id')
      setPostId(postId)

      const fetchData = async () => {
        const { message: fetchedDetail } = await getRequestByUri(URL.GET_POST_DETAIL + postId)
        setPostDetail(fetchedDetail)
      }

      fetchData()
    } catch (err) {
      console.log(err)
    }
  }, [])

  const rowData = (item, index) => {
    return (
      <CRow className="mb-1" key={index}>
        <CCol xs={3}>
          <div className="p-2 border bg-light">{item.label}</div>
        </CCol>
        {/* {postData[item.field] && (
          <CCol xs={9}>
            <div className="p-2 border bg-light">{postData[item.field]}</div>
          </CCol>
        )} */}
      </CRow>
    )
  }
  const renderPageContent = () => {
    return (
      <Suspense>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>{'View Post'} </strong>
                {/* {postId && <strong>{' Post Id: ' + postId}</strong>} */}
              </CCardHeader>
              <CCardBody>
                {tableField && tableField.map((item, index) => rowData(item, index))}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </Suspense>
    )
  }

  return <>{renderPageContent()}</>
}

export default ViewPost
