import React, { Component, Suspense, useState } from 'react'
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const isLoggedIn = () => {
  /*let islogin = false
  console.log('islogin', islogin)
  const loggedInUser = localStorage.getItem('user')
  if (loggedInUser) {
    islogin = true
  }
  console.log('islogin', islogin)
  return islogin*/
  console.log('islogin')
  return true
  //next()
}

//class App extends Component {

function App() {
  const getUser = () => {
    const tokenString = sessionStorage.getItem('user')
    return tokenString
  }

  const [user, setUser] = useState(getUser())
  //let navigate = useNavigate()
  //console.log('user', user)
  if (user == 'undefined' || user == null || user == '') {
    console.log('tes user', user)
    //navigate('/login')
    //return <Login setUser={setUser} />
  }

  //}
  //  render() {
  return (
    <HashRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
          {/* <Route
              path="*"
              name="Home"
              onEnter={() => (isLoggedIn() ? <DefaultLayout /> : <Login />)}
            /> */}
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
