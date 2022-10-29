import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  let navigate = useNavigate()
  let tokenstring = sessionStorage.getItem('user')
  // if (!tokenstring) {
  //   console.log('user not login')
  //   return <Login />
  // }

  useEffect(() => {
    if (!tokenstring) {
      navigate('/login')
    }
  }, [])

  return (
    <div>
      <AppSidebar user_level={sessionStorage.getItem('level_id')} />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
