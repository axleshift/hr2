import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import cookie from 'js-cookie'
import { post } from '../api/axios'

// Create the context
export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false) || cookie.get('isAuthenticated')
  const [userInformation, setUserInformation] = useState({}) || cookie.get('userInformation')

  const login = async (username, password, callback) => {
    try {
      // setIsAuthenticated(true)
      // callback(true)
      const res = await post('/auth/login', { username, password })
      if (res.status === 200) {
        setIsAuthenticated(true)
        cookie.set('isAuthenticated', true)
        cookie.set('userInformation', res.data.data)
        callback(true)
      } else {
        callback(false)
      }
    } catch (error) {
      callback(false)
      console.error(error)
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    cookie.remove('isAuthenticated')
  }

  useEffect(() => {
    const auth = cookie.get('isAuthenticated')
    if (auth) {
      setIsAuthenticated(true)
    }
  }, [])

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
