import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Cookies from 'js-cookie'
import { post, get } from '../api/axios'

export const AuthContext = createContext({
  userInformation: {
    _id: '',
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    status: '',
    role: '',
  },
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  sendOTP: () => {},
  verifyOTP: () => {},
  redirectToOtpPage: false, // New state to handle OTP page redirection
})

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInformation, setUserInformation] = useState({
    _id: '',
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    status: '',
    role: '',
  })
  const [otpSent, setOtpSent] = useState(false)
  const [redirectToOtpPage, setRedirectToOtpPage] = useState(false)

  // Login function with new device detection and OTP redirection logic
  const login = async (username, password, callback) => {
    try {
      const res = await post('/auth/login', { username, password })
      if (res.status === 200) {
        setIsAuthenticated(true)
        setUserInformation(res.data.data)

        // If redirectToOtpPage is true, it means OTP verification is required
        if (res.data.redirectToOtpPage) {
          setRedirectToOtpPage(true)
          callback(true)
        } else {
          callback(true) // Directly authenticated
        }
      } else {
        callback(false)
      }
    } catch (error) {
      callback(false)
      console.error(error)
    }
  }

  const sendOTP = async (username, callback) => {
    try {
      const res = await post('/auth/send-otp', { username })
      if (res.status === 200) {
        setOtpSent(true)
        callback(true)
      } else {
        callback(false)
      }
    } catch (error) {
      callback(false)
      console.error(error)
    }
  }

  const verifyOTP = async (otp, callback) => {
    try {
      const res = await post('/auth/verify-otp', { otp })
      if (res.status === 200) {
        setIsAuthenticated(true)
        setUserInformation(res.data.data)
        setRedirectToOtpPage(false) // OTP is verified, no need to redirect
        callback(true)
      } else {
        callback(false)
      }
    } catch (error) {
      callback(false)
      console.error(error)
    }
  }

  const logout = async (callback) => {
    try {
      const res = await get('/auth/logout')
      if (res.status === 200) {
        setIsAuthenticated(false)
        setUserInformation({
          _id: '',
          firstname: '',
          lastname: '',
          email: '',
          username: '',
          status: '',
          role: '',
        })
        callback(true)
      }
    } catch (error) {
      callback(false)
      console.error(error)
    }
  }

  const verifySession = async () => {
    try {
      const res = await get('/auth/me')
      if (res.status === 200) {
        setIsAuthenticated(true)
        setUserInformation(res.data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    verifySession()
  }, [isAuthenticated])

  return (
    <AuthContext.Provider
      value={{
        userInformation,
        isAuthenticated,
        login,
        logout,
        sendOTP,
        verifyOTP,
        otpSent,
        redirectToOtpPage,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AuthProvider
