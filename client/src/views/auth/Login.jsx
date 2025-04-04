import React, { useState, useEffect, useRef, useContext } from 'react'
import { AuthContext } from '../../context/authContext'
import { AppContext } from '../../context/appContext'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { config } from '../../config'
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
  CFormFeedback,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const Login = () => {
  const navigate = useNavigate()
  const recaptchaRef = useRef()
  const { login, isAuthenticated } = useContext(AuthContext)
  const { addToast } = useContext(AppContext)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const loginSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long').max(20),
    password: z.string().min(8, 'Password must be at least 8 characters long').max(50),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  // const onSubmit = (data) => {
  //   setIsLoading(true)
  //   const token = recaptchaRef.current.getValue()
  //   login(data.username, data.password, (success) => {
  //     setIsLoading(false)
  //     if (success) {
  //       navigate('/dashboard/overview')
  //     } else {
  //       setErrorMessage('Invalid username or password')
  //     }
  //   })
  // }

  const onSubmit = (data) => {
    setIsLoading(true)

    if (recaptchaRef.current) {
      recaptchaRef.current.execute() // Trigger reCAPTCHA validation
      recaptchaRef.current.data = data // Store form data inside recaptchaRef
    } else {
      console.error('reCAPTCHA ref is not available.')
      setIsLoading(false)
    }
  }

  const onReCAPTCHAChange = (token) => {
    if (!token) {
      console.error('reCAPTCHA token is undefined.')
      setErrorMessage('reCAPTCHA validation failed. Please try again.')
      setIsLoading(false)
      return
    }

    // Retrieve stored form data from recaptchaRef
    const formData = recaptchaRef.current.data
    if (!formData) {
      console.error('Form data is missing.')
      setIsLoading(false)
      return
    }

    login(formData.username, formData.password, (success) => {
      setIsLoading(false)
      if (success) {
        // navigate('/dashboard/overview')
        navigate('/recruitment/jobposting')
      } else {
        setErrorMessage('Invalid username or password')
      }
    })
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} lg={6} xl={5} className="my-2">
            <CCard className="p-1 p-sm-4 shadow">
              <CCardBody>
                {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <h1>Login</h1>
                  <p className="text-body-secondary">Sign In to your account</p>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    size="invisible"
                    sitekey={config.google.recaptcha.siteKey}
                    onChange={onReCAPTCHAChange}
                  />

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Username"
                      autoComplete="username"
                      {...register('username')}
                      invalid={!!errors.username}
                    />
                    {errors.username && (
                      <CFormFeedback invalid>{errors.username.message}</CFormFeedback>
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
                      {...register('password')}
                      invalid={!!errors.password}
                    />
                    <CInputGroupText onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                      <CTooltip
                        content={isPasswordVisible ? 'Hide password' : 'Show password'}
                        placement="top"
                      >
                        <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} />
                      </CTooltip>
                    </CInputGroupText>
                    {errors.password && (
                      <CFormFeedback invalid>{errors.password.message}</CFormFeedback>
                    )}
                  </CInputGroup>

                  <p>
                    <small>
                      By continuing, you agree to our
                      <a onClick={() => navigate('/PolicyTerms')} className="link-primary">
                        {' '}
                        Privacy Policy{' '}
                      </a>
                      and
                      <a onClick={() => navigate('/PolicyTerms')} className="link-primary">
                        {' '}
                        Terms of Service
                      </a>
                      .
                    </small>
                  </p>

                  <div className="d-grid">
                    <CButtonGroup>
                      {!isLoading ? (
                        <>
                          <CButton type="submit" color="primary">
                            Login
                          </CButton>
                          <CButton color="outline-primary" onClick={() => navigate('/register')}>
                            Signup
                          </CButton>
                        </>
                      ) : (
                        <CButton color="outline-info" disabled>
                          <CSpinner size="sm" /> <span>Logging in...</span>
                        </CButton>
                      )}
                    </CButtonGroup>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        {config.env === 'development' && (
          <CRow>
            <CCol>
              <div className="text-center mt-3">Developer Build</div>
            </CCol>
          </CRow>
        )}
        <CRow>
          <CCol>
            <div className="text-center mt-3">
              <small>
                <span className="text-muted">{config.appVersion}</span>
              </small>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
