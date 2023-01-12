import React, { useState, useEffect, Suspense } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

import { getRequestByUri, execSPWithoutInput } from '../../utils/request-marketing'
import { PostBanner } from 'src/components'

const PostCalendar = () => {
  const today = new Date()
  const [missedPost, setMissedPost] = useState([])
  const [todayPost, setTodayPost] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { message: missedPost } = await getRequestByUri('/getMissedPost')
        const { message: todayPost } = await execSPWithoutInput(
          '[MARKETING].[dbo].[SP_GetTodayPost]',
        )

        setMissedPost(missedPost)
        setTodayPost(todayPost)
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

  const renderTodayPost = () => {
    return (
      <CCol xs={12} md={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{`Today's Posts`}</strong>
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
            <strong>{`Missed Posts`}</strong>
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
            event: { start, title, id },
          } = arg
          const payload = { start, title, id }
          handleEventClick(payload)
        }}
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

export default PostCalendar
