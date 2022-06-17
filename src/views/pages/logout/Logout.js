import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
//import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const Logout = () => {
  let navigate = useNavigate()
  let tokenstring = sessionStorage.getItem('user')
  // if (!tokenstring) {
  //   console.log('user not login')
  //   return <Login />
  // }

  useEffect(() => {
    if (tokenstring) {
      sessionStorage.removeItem('user')
      navigate('/login')
    }
  }, [])

  return <div>logout</div>
}

export default Logout
