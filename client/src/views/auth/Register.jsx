import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAt, faExclamation, faLock, faUserAlt } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { post } from '../../api/axios'
import { AppContext } from '../../context/appContext'

const Register = () => {
  const { addToast } = React.useContext(AppContext)
  const [isLoading, setIsLoading] = React.useState(false)
  const [alertMessage, setAlertMessage] = React.useState('')
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate('/login')
  }
  const registerFormSchema = z
    .object({
      firstname: z.string().min(3, { message: 'Firstname must be at least 3 characters long' }),
      lastname: z.string().min(3, { message: 'Lastname must be at least 3 characters long' }),
      username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
      email: z.string().email({ message: 'Invalid email format' }),
      password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
      repeatPassword: z
        .string()
        .min(8, { message: 'Repeat password must be at least 8 characters long' }),
    })
    .refine((data) => data.password === data.repeatPassword, {
      message: 'Passwords do not match',
      path: ['repeatPassword'], // Point the error at `repeatPassword`
    })

  const {
    register: registerRegister,
    reset: registerReset,
    handleSubmit: registerHandleSubmit,
    formState: { errors: registerErrors },
  } = useForm({
    // resolver: zodResolver(registerFormSchema),
    resolver: async (data, context, options) => {
      const result = await zodResolver(registerFormSchema)(data, context, options)
      console.log('Validation result:', result)
      return result
    },
  })

  const handleRegister = async (data) => {
    setIsLoading(true)
    try {
      const res = await post('/auth/register', data)
      console.log(res)
      if (res.status === 201) {
        registerReset()
        const txt = (
          <span>
            Account created successfully. Please check your <strong>email</strong> to verify your
            account.
          </span>
        )
        setAlertMessage(txt)
        setIsLoading(false)
      } else {
        addToast('Error', 'An error occurred while creating account.', 'error')
        setIsLoading(false)
      }
    } catch (error) {
      console.error(error)
      addToast('Error', 'An error occurred while creating account.', 'error')
      setIsLoading(false)
    }
  }

  return (
    <div className="d-flex flex-row align-items-center bg-body-tertiary min-vh-100">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                {alertMessage && (
                  <CAlert color="success" className="d-flex align-items-center">
                    <div className="me-2">
                      <FontAwesomeIcon icon={faExclamation}></FontAwesomeIcon>
                    </div>
                    <div>
                      <span>{alertMessage}</span>
                    </div>
                  </CAlert>
                )}
                <CForm onSubmit={registerHandleSubmit(handleRegister)}>
                  <CRow>
                    <CCol>
                      <h1>Register</h1>
                      <p className="text-body-secondary">Create your account</p>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <FontAwesomeIcon icon={faUserAlt} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Firstname"
                          autoComplete="firstname"
                          {...registerRegister('firstname')}
                          invalid={!!registerErrors.firstname}
                        />
                        {registerErrors.firstname && (
                          <CFormFeedback invalid>{registerErrors.firstname.message}</CFormFeedback>
                        )}
                        <CInputGroupText>
                          <FontAwesomeIcon icon={faUserAlt} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Lastname"
                          autoComplete="lastname"
                          {...registerRegister('lastname')}
                          invalid={!!registerErrors.lastname}
                        />
                        {registerErrors.firstname && (
                          <CFormFeedback invalid>{registerErrors.firstname.message}</CFormFeedback>
                        )}
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <FontAwesomeIcon icon={faUserAlt} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Username"
                          autoComplete="username"
                          {...registerRegister('username')}
                          invalid={!!registerErrors.username}
                        />
                        {registerErrors.username && (
                          <CFormFeedback invalid>{registerErrors.username.message}</CFormFeedback>
                        )}
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <FontAwesomeIcon icon={faAt} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Email"
                          autoComplete="email"
                          {...registerRegister('email')}
                          invalid={!!registerErrors.email}
                        />
                        {registerErrors.email && (
                          <CFormFeedback invalid>{registerErrors.email.message}</CFormFeedback>
                        )}
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <FontAwesomeIcon icon={faLock} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          autoComplete="new-password"
                          {...registerRegister('password')}
                          invalid={!!registerErrors.password}
                        />
                        {registerErrors.password && (
                          <CFormFeedback invalid>{registerErrors.password.message}</CFormFeedback>
                        )}
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <FontAwesomeIcon icon={faLock} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Repeat password"
                          autoComplete="new-password"
                          {...registerRegister('repeatPassword')}
                          invalid={!!registerErrors.repeatPassword}
                        />
                        {registerErrors.repeatPassword && (
                          <CFormFeedback invalid>
                            {registerErrors.repeatPassword.message}
                          </CFormFeedback>
                        )}
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  <CRow
                    xs={{
                      cols: 1,
                      gutter: 2,
                    }}
                    md={{
                      cols: 2,
                      gutter: 2,
                    }}
                    className="mb-3"
                  >
                    <CCol className="d-grid">
                      <CButton variant="outline" color="info" onClick={handleGoBack}>
                        Login
                      </CButton>
                    </CCol>
                    <CCol className="d-grid">
                      <CButton type="submit" color="success" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Create account'}
                      </CButton>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
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
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
