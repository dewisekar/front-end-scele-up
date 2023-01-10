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
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const PostCalendar = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [postId, setPostId] = useState(null)
  const [postDetail, setPostDetail] = useState(null)
  const [formatTable, setFormatTable] = useState(null)
  const [postData, setPostData] = useState(null)
  const today = new Date()
  useEffect(() => {}, [])

  return (
    <Suspense fallback={loading}>
      <CRow>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{`Today's Posts`}</strong>
            </CCardHeader>
          </CCard>
        </CCol>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{`Missed Posts`}</strong>
            </CCardHeader>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{'Post Calendar'} </strong>
            </CCardHeader>
          </CCard>
        </CCol>
      </CRow>
    </Suspense>
  )
}

export default PostCalendar
