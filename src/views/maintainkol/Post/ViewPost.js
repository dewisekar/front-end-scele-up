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

import { tableField, styles, statisticField, postStatisticKey } from './ViewPost.config'
import { getRequestByUri } from '../../../utils/request-marketing'
import { URL, ColumnSizePercentage, PostStatus } from 'src/constants'
import { VerticalTableRow, LoadingAnimation } from 'src/components'
import { getPostStatus, convertDate } from 'src/utils/pageUtil'
import { countPostStatistic } from 'src/utils/postUtil'
import { RupiahCurrency } from 'src/components'

const ViewPost = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [postId, setPostId] = useState(null)
  const [postDetail, setPostDetail] = useState({})
  const [postStatistic, setPostStatistic] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      let postId = searchParams.get('Id')
      setPostId(postId)

      const fetchData = async () => {
        const { message: fetchedDetail } = await getRequestByUri(URL.GET_POST_DETAIL + postId)
        const { message: fetchedStatistic } = await getRequestByUri(
          URL.GET_POST_STATISTIC_BY_POST_ID + postId,
        )

        const { uploadDate, deadlineDate, costPerSlot, isFyp } = fetchedDetail
        const convertedUploadDate = uploadDate ? new Date(uploadDate) : null
        const convertedIsFyp = isFyp === 2 ? 'FYP' : 'Belum FYP'

        const postStatus = PostStatus[getPostStatus(new Date(deadlineDate), convertedUploadDate)]
        const convertedDeadline = convertDate(deadlineDate)
        const convertedUpload = uploadDate ? convertDate(deadlineDate) : null

        const mappedStatistic = fetchedStatistic.map((data) => {
          const countedStat = countPostStatistic({ ...data, costPerSlot }, postStatisticKey)
          const { cpm, costPerViews } = countedStat

          return {
            ...data,
            dayNumber: 'H+' + data.dayNumber,
            ...countedStat,
            cpm: new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
            }).format(cpm),
            costPerViews: new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
            }).format(costPerViews),
          }
        })

        setPostDetail({
          ...fetchedDetail,
          postStatus,
          deadlineDate: convertedDeadline,
          uploadDate: convertedUpload,
          costPerSlot: <RupiahCurrency balance={costPerSlot} />,
          isFyp: convertedIsFyp,
        })
        setPostStatistic(mappedStatistic)
        setIsLoading(false)
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
                  <strong>{`Detail Post`}</strong>
                </CCol>
                <CCol md={6} className="d-flex align-items-start justify-content-end">
                  {!postDetail.uploadDate && (
                    <CButton
                      color="light"
                      onClick={() => (window.location.href = `./#/Post/UpdatePost?Id=` + postId)}
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
                  <strong>Statistik Post</strong>
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
                        <CTableHeaderCell
                          scope="col"
                          colSpan="4"
                          color="primary"
                          style={{ borderColor: 'black' }}
                        >
                          Engagement Meter
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
                      {postStatistic.length > 0 ? (
                        postStatistic.map((data, index) => (
                          <CTableRow key={index}>{renderStatsRow(data)}</CTableRow>
                        ))
                      ) : (
                        <CTableRow>
                          <CTableDataCell colSpan="15" className="text-center">
                            NO DATA AVAILABLE
                          </CTableDataCell>
                        </CTableRow>
                      )}
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

  const renderLoadingAnimation = () => {
    return <LoadingAnimation />
  }
  const renderPageContent = () => {
    return (
      <Suspense>
        {renderPostDetail()}
        {renderPostStatistic()}
      </Suspense>
    )
  }

  return <>{isLoading ? renderLoadingAnimation() : renderPageContent()}</>
}

export default ViewPost
