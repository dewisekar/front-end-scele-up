import React, { useState, useEffect, Suspense } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

import { execSPWithoutInput } from '../../utils/request-marketing'
import { PostBanner, LoadingAnimation } from 'src/components'
import { StoredProcedure, EventColor, DateMode } from 'src/constants'
import { convertDate, getPostStatus } from 'src/utils/pageUtil'

const PostCalendar = () => {
  const today = new Date()
  const [missedPost, setMissedPost] = useState([])
  const [todayPost, setTodayPost] = useState([])
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { message: missedPost } = await execSPWithoutInput(StoredProcedure.GET_MISSED_POST)
        const { message: todayPost } = await execSPWithoutInput(StoredProcedure.GET_TODAY_POST)
        const { message: allPost } = await execSPWithoutInput(StoredProcedure.GET_ALL_POST)
        const convertedEvent = convertCalendarEvent(allPost)

        setMissedPost(missedPost)
        setTodayPost(todayPost)
        setPosts(convertedEvent)
        setIsLoading(false)
      } catch (error) {
        throw error
      }
    }

    fetchData()
  }, [])

  const handleEventClick = (payload) => {
    console.log(payload)
    console.log('event clicked')
  }

  const convertCalendarEvent = (data) => {
    const convertedEvent = data.map((item, index) => {
      const deadlinePost = new Date(item['deadlinePost'])
      const uploadDate = item['uploadDate'] ? new Date(item['uploadDate']) : null
      const postStatus = getPostStatus(deadlinePost, uploadDate)

      return {
        title: item['Kontrak Name'],
        date: convertDate(item['deadlinePost'], DateMode.YYYYMMDD),
        postId: item['Id'],
        color: EventColor[postStatus],
      }
    })

    return convertedEvent
  }

  const renderTodayPost = () => {
    return (
      <CCol xs={12} md={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <CRow>
              <CCol md={6}>
                <strong>{`Today's Posts`}</strong>
              </CCol>
              <CCol md={6}>
                <strong style={{ display: 'block', textAlign: 'right' }}>
                  {convertDate(today)} | Jumlah: {todayPost.length}
                </strong>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CRow>{renderPostBanner(todayPost)}</CRow>
          </CCardBody>
        </CCard>
      </CCol>
    )
  }

  const renderPostBanner = (data) => {
    const banners = data.map((item, index) => {
      return <PostBanner key={index} props={item} />
    })
    return banners
  }

  const renderMissedPost = () => {
    return (
      <CCol xs={12} md={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <CRow>
              <CCol md={6}>
                <strong>{`Missed Posts`}</strong>
              </CCol>
              <CCol md={6}>
                <strong style={{ display: 'block', textAlign: 'right' }}>
                  Jumlah: {missedPost.length}
                </strong>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CRow>{renderPostBanner(missedPost)}</CRow>
          </CCardBody>
        </CCard>
      </CCol>
    )
  }

  const renderCalendar = () => {
    return (
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        dayMaxEventRows={3}
        eventClick={function (arg) {
          const {
            event: {
              start,
              title,
              extendedProps: { postId },
            },
          } = arg
          const payload = { start, title, postId }
          handleEventClick(payload)
        }}
        events={posts}
        editable
      />
    )
  }

  const renderCalendarContainer = () => {
    return (
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{'Post Calendar'} </strong>
          </CCardHeader>
          <CCardBody>{renderCalendar()}</CCardBody>
        </CCard>
      </CCol>
    )
  }

  const renderLoadingAnimation = () => {
    return <LoadingAnimation />
  }

  const renderPage = () => {
    return (
      <Suspense>
        <CRow>
          {renderTodayPost()}
          {renderMissedPost()}
        </CRow>
        <CRow>{renderCalendarContainer()}</CRow>
      </Suspense>
    )
  }

  return <>{isLoading ? renderLoadingAnimation() : renderPage()}</>
}

export default PostCalendar
