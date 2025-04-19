import React, { useState, useEffect, useContext } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CAlert,
  CFormFeedback,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthContext } from '../../context/authContext'
import { post } from '../../api/axios'
import { useNavigate } from 'react-router-dom'

// Zod schema
const otpSchema = z.object({
  otp: z
    .string()
    .min(6, 'OTP must be 6 digits')
    .max(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'OTP must only contain numbers'),
})

const OTPPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(otpSchema),
  })

  const navigate = useNavigate()
  const { userInformation } = useContext(AuthContext)

  const [resendTimer, setResendTimer] = useState(0)
  const [resendMessage, setResendMessage] = useState('')
  const [submissionError, setSubmissionError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      formData.append('username', userInformation.username)
      formData.append('otp', data.otp)

      const res = await post('/auth/verify-otp', formData)

      if (res.status === 200) {
        setSuccessMessage('OTP Verified Successfully!')
        setSubmissionError('')
        setTimeout(() => navigate('/dashboard'), 1500)
      }
    } catch (error) {
      console.error(error)
      setSubmissionError(error?.response?.data?.message || 'Verification failed. Please try again.')
    }
  }

  const handleResendOtp = async () => {
    try {
      const formData = new FormData()
      formData.append('username', userInformation.username)

      const res = await post('/auth/send-otp', formData)

      if (res.status === 200) {
        setResendMessage('A new OTP has been sent to your email.')
        setResendTimer(60)
        reset()
      }
    } catch (error) {
      console.error(error)
      setResendMessage('Failed to resend OTP. Please try again later.')
    }
  }

  useEffect(() => {
    if (resendTimer === 0) return
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [resendTimer])

  return (
    <CContainer className="mt-5">
      <CRow className="justify-content-center">
        <CCol md={6} lg={5}>
          <h2 className="mb-4 text-center">Verify One-Time Password</h2>

          {successMessage && <CAlert color="success">{successMessage}</CAlert>}
          {submissionError && <CAlert color="danger">{submissionError}</CAlert>}

          <CForm onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <CFormLabel htmlFor="otp">Enter OTP</CFormLabel>
              <CFormInput
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                {...register('otp')}
                invalid={!!errors.otp}
              />
              {errors.otp && (
                <CFormFeedback className="d-block">
                  <small>{errors.otp.message}</small>
                </CFormFeedback>
              )}
            </div>
            <div className="d-grid mb-3">
              <CButton color="primary" type="submit">
                Verify OTP
              </CButton>
            </div>
          </CForm>

          <div className="text-center">
            <CButton
              color="secondary"
              variant="outline"
              size="sm"
              disabled={resendTimer > 0}
              onClick={handleResendOtp}
            >
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
            </CButton>
            {resendMessage && (
              <CAlert color="info" className="mt-3">
                {resendMessage}
              </CAlert>
            )}
          </div>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default OTPPage
