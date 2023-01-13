import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CNav, CNavLink, CNavItem } from '@coreui/react'
import { tableField, styles } from './ViewPost.config'
import { getRequestByUri } from '../../utils/request-marketing'
import { URL } from 'src/constants'
import { VerticalTableRow } from 'src/components'
import { ColumnSizePercentage } from 'src/constants'

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
        console.log('ini fetched', fetchedDetail)
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
                <strong>{'View Post'} </strong>
                {/* {postId && <strong>{' Post Id: ' + postId}</strong>} */}
              </CCardHeader>
              <CCardBody>
                <CRow>
                  {tableField &&
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
