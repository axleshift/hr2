import React, { useState, useEffect, useRef } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../../context/authContext'
import { AppContext } from '../../../context/appContext'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { config } from '../../../config'
import ReCAPTCHA from 'react-google-recaptcha'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
  CButtonGroup,
  CAlert,
  CTooltip,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock, faX, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons'

const Login = () => {
  const navigate = useNavigate()
  const recaptchaRef = useRef()
  const { login, isAuthenticated, userInformation } = useContext(AuthContext)
  const { addToast } = useContext(AppContext)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [captchaValue, setCaptchaValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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
    const token = recaptchaRef.current.getValue()
    console.log('Login.js: onSubmit: token: ', token)
    setCaptchaValue(token)
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
        setErrorMessage('Invalid username or password')
        setIsLoading(false)
      }
    })
  }

  const handleGoogleLogin = () => {}

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated])

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        {isLoading && (
          <div className="loading-overlay">
            <CSpinner color="primary" variant="grow" />
          </div>
        )}
        <CRow className="justify-content-center">
          <CCol md={8} lg={6} xl={5} className="my-2">
            <CCard className="p-1 p-sm-4 shadow">
              <CCardBody>
                {errorMessage && (
                  <CAlert color="danger" className="d-flex align-items-center">
                    <div className="me-2">
                      <FontAwesomeIcon icon={faX} />
                    </div>
                    <div>
                      <span>{errorMessage}</span>
                    </div>
                  </CAlert>
                )}
                <CForm onSubmit={loginHandleSubmit(onSubmit)}>
                  <h1>Login</h1>
                  <p className="text-body-secondary">Sign In to your account</p>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    size="invisible"
                    sitekey={config.google.recaptcha.siteKey}
                  />
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
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faLock} />
                    </CInputGroupText>
                    <CFormInput
                      type={isPasswordVisible ? 'text' : 'password'}
                      placeholder="Password"
                      autoComplete="current-password"
                      {...loginRegister('password')}
                      invalid={!!loginErrors.password}
                    />
                    <CInputGroupText>
                      <CTooltip
                        content={isPasswordVisible ? 'Hide password' : 'Show password'}
                        placement="top"
                      >
                      <span
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      >
                        <FontAwesomeIcon
                          icon={isPasswordVisible ? faEyeSlash : faEye}
                        />
                      </span>
                      </CTooltip>
                    </CInputGroupText>
                    {loginErrors.password && (
                      <div className="invalid-feedback">{loginErrors.password.message}</div>
                    )}
                  </CInputGroup>
                  <p>
                    <small>
                      By continuing, you agree to our
                      <a
                        onClick={() => navigate('/policy')}
                        className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                      >
                        {' '}
                        Privacy Policy{' '}
                      </a>
                      and
                      <a
                        onClick={() => navigate('/terms')}
                        className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                      >
                        {' '}
                        Terms of Service
                      </a>
                      .
                    </small>
                  </p>
                  <div className="d-grid mb-3">
                    <CButtonGroup>
                      <CButton type="submit" color="primary" className="me-2 rounded">
                        Login
                      </CButton>
                      <CButton disabled color="outline-primary" className="me-2 rounded">
                        Signup
                      </CButton>
                    </CButtonGroup>
                  </div>
                  <div className="text-center visually-hidden">
                    <span className="text-muted d-block mb-1">
                      <small>Or continue with</small>
                    </span>
                    <CButton color="outline-primary" className="me-2" onClick={handleGoogleLogin}>
                      <FontAwesomeIcon icon={faGoogle} />
                    </CButton>
                    <CButton
                      color="outline-primary"
                      className="me-2"
                      // onClick={() =>
                      //   (window.location.href = `https://github.com/login/oauth/authorize?client_id=${VITE_APP_GITHUB_OAUTH_CLIENT_ID}`)
                      // }
                    >
                      <FontAwesomeIcon icon={faGithub} />
                    </CButton>
                  </div>
                </CForm>
                <CButton
                  color="link"
                  className="px-0 link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot password?
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
