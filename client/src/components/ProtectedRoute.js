import React, { useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import propTypes from 'prop-types'
const ProtectedRoute = ({ children }) => {
  const env = import.meta.env.VITE_NODE_ENV
  console.log("ProtectedRoute.js: env: ", env)
  const { isAuthenticated } = useContext(AuthContext)

  if (env === 'development') {
    return children
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

ProtectedRoute.propTypes = {
  children: propTypes.node.isRequired,
}

export default ProtectedRoute
