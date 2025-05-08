import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'
import AuthProvider from './context/authContext'
import AppProvider from './context/appContext'
import ProtectedRoute from './components/ProtectedRoute'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import { config } from './config'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/auth/Login'))
const Register = React.lazy(() => import('./views/auth/Register'))
const VerifyEmail = React.lazy(() => import('./views/auth/VerifyEmail'))
const OTPPage = React.lazy(() => import('./views/auth/Otp'))

const Page404 = React.lazy(() => import('./views/errors/Page404'))
const Page500 = React.lazy(() => import('./views/errors/Page500'))

const Policy = React.lazy(() => import('./views/legal/PolicyTerms'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GoogleOAuthProvider clientId={config.google.oAuth2.clientId}>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Suspense
              fallback={
                <div className="text-center pt-3">
                  <CSpinner color="primary" variant="grow" />
                </div>
              }
            >
              <Routes>
                <Route path="/login" name="Login Page" element={<Login />} />
                <Route path="/register" name="Register Page" element={<Register />} />
                <Route path="/otp" name="OTP Page" element={<OTPPage />} />
                <Route path="/404" name="Page 404" element={<Page404 />} />
                <Route path="/500" name="Page 500" element={<Page500 />} />
                <Route path="/PolicyTerms" name="Privacy Policy And Terms" element={<Policy />} />

                {/* Protect DefaultLayout route */}
                <Route
                  path="*"
                  name="Home"
                  element={
                    <ProtectedRoute>
                      <DefaultLayout theme={storedTheme} />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App
