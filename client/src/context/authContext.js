import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Cookies from 'js-cookie'
import { post, get } from '../api/axios'

// Create the context
export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInformation, setUserInformation] = useState({
    _id: '',
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    status: '',
    role: '',
    token: '',
  }) 

  const login = async (username, password, callback) => {
    try {
      const res = await post('/auth/login', { username, password })
      if (res.status === 200) {
        setIsAuthenticated(true)
        setUserInformation(res.data.data)
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
          token: '',
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
      const res = await get('/auth/verify')
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
    <AuthContext.Provider value={{ userInformation, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AuthProvider
