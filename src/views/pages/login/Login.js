import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilBank } from '@coreui/icons'
//import { getUsername } from '../../../utils/sqlservice'
import { authenticateUsername } from '../../../utils/axios-request'

const Login = (props) => {
  //const [success, setSuccess] = useState(false)
  const [company, setCompany] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  let navigate = useNavigate()

  const ErrorModal = () => {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sorry</Modal.Title>
        </Modal.Header>
        <Modal.Body>Server is under maintenance!</Modal.Body>
      </Modal>
    )
  }
  const handleOnSubmit = () => {
    // let isError = true
    // let countError = 0
    // while (isError && countError <= 2) {

    // }
    try {
      let res = authenticateUsername(username, company, password)
      res.then(function (result) {
        if (result != undefined) {
          if (result.status === 'true') {
            //isError = false
            //setSuccess(true)
            sessionStorage.setItem('user', JSON.stringify(username))
            sessionStorage.setItem('level_id', result.LEVEL_ID)
            let tokenString = sessionStorage.getItem('user')
            //let userToken = JSON.parse(tokenString)
            //console.log(tokenString)
            props.setUser(username)
            navigate('/dashboard')
          } else {
            //alert('Login failed')
            handleShow()
          }
        } else {
          //countError += 1
          handleShow()
          //alert('Website Under Maintenance')
        }
      })
    } catch (err) {
      //countError += 1
      console.log(err)
      alert(err)
    }
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <ErrorModal />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  {/* <CForm
                    onSubmit={handleOnSubmit}
                    // method="post"
                    //encType="multipart/form-data"
                  > */}
                  <h1>Login</h1>
                  <p className="text-medium-emphasis">Sign In to your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilBank} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Company ID"
                      autoComplete="company"
                      value={company}
                      onChange={(e) => {
                        setCompany(e.target.value)
                      }}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value)
                      }}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                      }}
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol xs={6}>
                      {/* <CButton color="primary" className="px-4" type="submit">
                          Login
                        </CButton> */}
                      <CButton
                        color="primary"
                        className="px-4"
                        active={'active' === 'active'}
                        variant="outline"
                        key="1"
                        onClick={handleOnSubmit}
                      >
                        Submit
                      </CButton>
                    </CCol>
                    <CCol xs={6} className="text-right">
                      <CButton color="link" className="px-0">
                        Forgot password?
                      </CButton>
                    </CCol>
                  </CRow>
                  {/* </CForm> */}
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p className="mt-5">Register your account</p>
                    <Link to="/register">
                      <CButton color="primary" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}
/*
const Login2 = () => {
  const [success, setSuccess] = useState(false)
  const [company, setCompany] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const form = (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm
                    onSubmit={() => {
                      let res = authenticateUsername(username, company, password)
                      res.then(function (result) {
                        if (result.status === 'true') {
                          console.log('success', success)
                          setSuccess(true)
                        }
                      })
                    }}
                    // method="post"
                    encType="multipart/form-data"
                  >
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilBank} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Company ID"
                        autoComplete="company"
                        value={company}
                        onChange={(e) => {
                          setCompany(e.target.value)
                        }}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value)
                        }}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                        }}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )

  return !success ? form : <DefaultLayout />
}*/

export default Login
