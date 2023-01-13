import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react'

import { tableField, styles } from './ViewPost.config'
import { getRequestByUri } from '../../utils/request-marketing'
import { URL, ColumnSizePercentage, PostStatus } from 'src/constants'
import { VerticalTableRow } from 'src/components'
import { getPostStatus, convertDate } from 'src/utils/pageUtil'

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
        const { uploadDate, deadlineDate } = fetchedDetail
        const convertedUploadDate = uploadDate ? new Date(uploadDate) : null

        const postStatus = PostStatus[getPostStatus(new Date(deadlineDate), convertedUploadDate)]
        const convertedDeadline = convertDate(deadlineDate)
        const convertedUpload = uploadDate ? convertDate(deadlineDate) : null

        setPostDetail({
          ...fetchedDetail,
          postStatus,
          deadlineDate: convertedDeadline,
          uploadDate: convertedUpload,
        })
      }

      fetchData()
    } catch (err) {
      console.log(err)
    }
  }, [])

  const renderDetailInfo = (fields, data, size = ColumnSizePercentage.FULL) => {
    const info = fields.map((item, index) => {
      return <VerticalTableRow key={index} props={{ item, data, size }} />
    })

    return info
  }

  const renderPageContent = () => {
    return (
      <Suspense>
        <CRow id="post-detail">
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <CRow>
                  <CCol md={6}>
                    <strong>{`View Post`}</strong>
                  </CCol>
                  <CCol md={6} className="d-flex align-items-start justify-content-end">
                    <CButton
                      color="light"
                      onClick={() =>
                        (window.location.href = `./#/MaintainKol/UpdatePost?Id=` + postId)
                      }
                    >
                      Update
                    </CButton>
                  </CCol>
                </CRow>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  {tableField &&
                    postDetail &&
                    renderDetailInfo(tableField, postDetail, ColumnSizePercentage.HALF)}
                </CRow>
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
