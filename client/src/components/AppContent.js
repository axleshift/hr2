import React, { Suspense, useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import { AuthContext } from '../context/authContext'

// routes config
import routes from '../routes'

const AppContent = () => {
  const { userInformation } = useContext(AuthContext)
  const userRole = userInformation?.role

  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            // Check if the user role is allowed to access the route
            const isAuthorized = route.permissions?.includes(userRole)

            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                  // element={
                  //   isAuthorized ? (
                  //     <route.element />
                  //   ) : (
                  //     <Navigate to="/404" replace /> // Redirect to a 404 or an unauthorized page
                  //   )
                  // }
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
