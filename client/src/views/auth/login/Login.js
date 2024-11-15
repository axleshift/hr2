import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../../context/authContext'
import { AppContext } from '../../../context/appContext'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
  CSpinner,
} from '@coreui/react'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Login = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated, userInformation } = useContext(AuthContext)
  const { addToast } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [isLoginError, setIsLoginError] = useState(false)
  const loginSchema = z.object({
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters long' })
      .max(20, { message: 'Username must be at most 20 characters long' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(50, { message: 'Password must be at most 50 characters long' }),
  })

  const {
    register: loginRegister,
    handleSubmit: loginHandleSubmit,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data) => {
    setIsLoading(true)
    login(data.username, data.password, (success) => {
      if (success) {
        setIsLoading(false)
        const username = userInformation.username
        console.log('Login.js: onSubmit: username: ', username)
        addToast(
          'Login successful',
          `
          Welcome back, ${data.username}! You have successfully logged in.
          `,
          'success',
        )
        navigate('/dashboard')
      } else {
        addToast('Login failed', 'Invalid username or password', 'danger')
        setIsLoading(false)
      }
    })
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated])

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard>
                <CCardBody>
                  <CForm className="text-center" onSubmit={loginHandleSubmit(onSubmit)}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CContainer className="d-flex flex-column gap-2">
                      <CRow>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <FontAwesomeIcon icon={faUser} />
                          </CInputGroupText>
                          <CFormInput
                            type="text"
                            placeholder="Username"
                            autoComplete="username"
                            {...loginRegister('username')}
                            invalid={!!loginErrors.username}
                          />
                          {loginErrors.username && (
                            <div className="invalid-feedback">{loginErrors.username.message}</div>
                          )}
                        </CInputGroup>
                        <CInputGroup>
                          <CInputGroupText>
                            <FontAwesomeIcon icon={faLock} />
                          </CInputGroupText>
                          <CFormInput
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            {...loginRegister('password')}
                            invalid={!!loginErrors.password}
                          />
                          {loginErrors.password && (
                            <div className="invalid-feedback">{loginErrors.password.message}</div>
                          )}
                        </CInputGroup>
                      </CRow>
                      <CRow>
                        <CCol className="d-flex flex-row gap-3 justify-content-center">
                          <CButton type="submit" color="primary" className="px-5">
                            {isLoading ? <CSpinner color="light" size="sm" /> : 'Login'}
                          </CButton>
                        </CCol>
                      </CRow>
                    </CContainer>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
