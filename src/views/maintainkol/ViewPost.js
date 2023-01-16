import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CTable,
  CTableRow,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

import { tableField, styles, statisticField } from './ViewPost.config'
import { getRequestByUri } from '../../utils/request-marketing'
import { URL, ColumnSizePercentage, PostStatus } from 'src/constants'
import { VerticalTableRow } from 'src/components'
import { getPostStatus, convertDate } from 'src/utils/pageUtil'
import { textAlign } from '@mui/system'

const ViewPost = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [postId, setPostId] = useState(null)
  const [postDetail, setPostDetail] = useState({})
  const [postStatistic, setPostStatistic] = useState([])

  useEffect(() => {
    try {
      let postId = searchParams.get('Id')
      setPostId(postId)

      const fetchData = async () => {
        const { message: fetchedDetail } = await getRequestByUri(URL.GET_POST_DETAIL + postId)
        const { message: fetchedStatistic } = await getRequestByUri(
          URL.GET_POST_STATISTIC_BY_POST_ID + postId,
        )
        console.log('ini fetched', fetchedStatistic)

        const { uploadDate, deadlineDate } = fetchedDetail
        const convertedUploadDate = uploadDate ? new Date(uploadDate) : null

        const postStatus = PostStatus[getPostStatus(new Date(deadlineDate), convertedUploadDate)]
        const convertedDeadline = convertDate(deadlineDate)
        const convertedUpload = uploadDate ? convertDate(deadlineDate) : null

        const mappedStatistic = fetchedStatistic.map((data) => {
          return {
            ...data,
            dayNumber: 'H+' + data.dayNumber,
          }
        })

        setPostDetail({
          ...fetchedDetail,
          postStatus,
          deadlineDate: convertedDeadline,
          uploadDate: convertedUpload,
        })
        setPostStatistic(mappedStatistic)
      }

      fetchData()
    } catch (err) {
      console.log(err)
    }
  }, [])

  const countStatisticPoint = (data) => {}

  const renderDetailInfo = (fields, data, size = ColumnSizePercentage.FULL) => {
    const info = fields.map((item, index) => {
      return <VerticalTableRow key={index} props={{ item, data, size }} />
    })

    return info
  }

  const renderStatsRow = (data) => {
    const day = [<CTableDataCell key="dayNumber">{data.dayNumber}</CTableDataCell>]
    const info = statisticField.map((item, index) => {
      return (
        <CTableDataCell key={item.key} className="text-center">
          {data[item.key]}
        </CTableDataCell>
      )
    })
    return [...day, ...info]
  }

  const renderPostDetail = () => {
    return (
      <CRow id="post-detail">
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <CRow>
                <CCol md={6}>
                  <strong>{`View Post`}</strong>
                </CCol>
                <CCol md={6} className="d-flex align-items-start justify-content-end">
                  {!postDetail.uploadDate && (
                    <CButton
                      color="light"
                      onClick={() =>
                        (window.location.href = `./#/MaintainKol/UpdatePost?Id=` + postId)
                      }
                    >
                      Update
                    </CButton>
                  )}
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
    )
  }

  const renderPostStatistic = () => {
    return (
      <CRow id="post-detail">
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <CRow>
                <CCol md={6}>
                  <strong>Statistic</strong>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody style={{ overflowX: 'scroll' }}>
              <CRow>
                <CCol lg={12}>
                  <CTable bordered style={{ overflowX: 'scroll', borderColor: 'black' }}>
                    <CTableHead>
                      <CTableRow className="text-center">
                        <CTableHeaderCell
                          scope="col"
                          rowSpan="5"
                          key="dayNumber"
                          color="light"
                          style={{ borderColor: 'black' }}
                        >
                          H+N
                        </CTableHeaderCell>
                        <CTableHeaderCell
                          scope="col"
                          colSpan="5"
                          color="secondary"
                          style={{ borderColor: 'black' }}
                        >
                          Statistik Post
                        </CTableHeaderCell>
                        <CTableHeaderCell
                          scope="col"
                          colSpan="3"
                          color="info"
                          style={{ borderColor: 'black' }}
                        >
                          Score Efektivitas (Ratio Per Metriks)
                        </CTableHeaderCell>
                        <CTableHeaderCell
                          scope="col"
                          colSpan="2"
                          color="dark"
                          style={{ borderColor: 'black' }}
                        >
                          Cost Worthiness
                        </CTableHeaderCell>
                      </CTableRow>
                      <CTableRow>
                        {statisticField.map((field) => (
                          <CTableHeaderCell
                            scope="col"
                            className="text-center"
                            key={field.key}
                            color={field.color}
                            style={{ borderColor: 'black' }}
                          >
                            {field.label}
                          </CTableHeaderCell>
                        ))}
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {postStatistic.map((data, index) => (
                        <CTableRow key={index}> {renderStatsRow(data)}</CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  const renderPageContent = () => {
    return (
      <Suspense>
        {renderPostDetail()}
        {renderPostStatistic()}
      </Suspense>
    )
  }

  return <>{renderPageContent()}</>
}

export default ViewPost
