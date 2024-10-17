import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Cookies from 'js-cookie'
import { post, get } from '../api/axios'

// Create the context
export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false) //|| Cookies.get('isAuthenticated')
  const [userInformation, setUserInformation] =
    useState({
      username: '',
      email: '',
      status: '',
      role: '',
      token: '',
    }) || Cookies.get('userInformation')

  const login = async (username, password, callback) => {
    try {
      const res = await post('/auth/login', { username, password })
      if (res.status === 200) {
        console.log('AuthContext.js: login: res: ', res)
        setIsAuthenticated(true)
        setUserInformation(res.data.data)
        Cookies.set('isAuthenticated', true)
        Cookies.set('userInformation', res.data.data)
        callback(true)
      } else {
        callback(false)
      }
    } catch (error) {
      callback(false)
      console.error(error)
    }
  }

  const logout = async () => {
    try {
      const res = await get('/auth/logout')
      console.log('AuthContext.js: logout: res: ', res)
      if (res.status === 200) {
        setIsAuthenticated(false)
        setUserInformation({
          username: '',
          email: '',
          status: '',
          role: '',
          token: '',
        })
        // Cookies.remove('isAuthenticated')
        Cookies.remove('userInformation')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const verifySession = async () => {
    try {
      const res = await get('/auth/verify')
      if (res.status === 200) {
        setIsAuthenticated(true)
        setUserInformation(res.data.data)
        // Cookies.set('isAuthenticated', true)
        Cookies.set('userInformation', res.data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    // verifySession()
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
