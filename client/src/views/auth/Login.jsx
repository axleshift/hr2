import React, { useState, useEffect, useRef, useContext } from 'react'
import { AuthContext } from '../../context/authContext'
import { AppContext } from '../../context/appContext'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { config } from '../../config'
import ReCAPTCHA from 'react-google-recaptcha'
import GoogleButton from 'react-google-button'
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
  const { login, sendOTP, otpSent, redirectToOtpPage } = useContext(AuthContext)
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

  const onSubmit = async (data) => {
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

    // Send OTP after login success
    login(formData.username, formData.password, (success) => {
      if (success) {
        // If OTP is needed, navigate to OTP page
        if (redirectToOtpPage) {
          setIsLoading(false)
          navigate('/otp') // Redirect to OTP page
        } else {
          sendOTP(formData.username, (otpSuccess) => {
            setIsLoading(false)
            if (otpSuccess) {
              navigate('/otp') // Redirect to OTP page after sending OTP
            } else {
              setErrorMessage('Failed to send OTP. Please try again.')
            }
          })
        }
      } else {
        setIsLoading(false)
        setErrorMessage('Login failed. Please check your credentials.')
      }
    })
  }

  const handleGoogleLogin = () => {
    window.location.href = config.google.oAuth2.url
  }

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

                  <div className="d-grid mb-3">
                    <CButtonGroup>
                      {!isLoading ? (
                        <CButton type="submit" color="primary">
                          Login
                        </CButton>
                      ) : (
                        <CButton color="outline-info" disabled>
                          <CSpinner size="sm" /> <span>Logging in...</span>
                        </CButton>
                      )}
                    </CButtonGroup>
                  </div>

                  <div className="d-flex justify-content-center">
                    <p className="text-muted fs-6"> OR </p>
                  </div>

                  <GoogleButton onClick={() => handleGoogleLogin()} />
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
