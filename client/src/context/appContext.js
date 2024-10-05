import React, { createContext, useState, useEffect } from 'react'
import propTypes from 'prop-types'
import { CToaster, CToast, CToastHeader, CToastClose, CToastBody } from '@coreui/react'
export const AppContext = createContext()

const AppProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', type: 'success' })
      }, 5000)

      // Cleanup the timer on component unmount or toast update
      return () => clearTimeout(timer)
    }
  }, [toast])

  return (
    <AppContext.Provider value={{ toast, setToast }}>
      {children}
      {toast.show && (
        <CToaster position="top-right">
          <CToast show={toast.show} autohide fade color={toast.type}>
            <CToastHeader closeButton={true}>
              {toast.type === 'success' ? 'Success' : 'Error'}
              <CToastClose
                onClick={() => setToast({ show: false, message: '', type: 'success' })}
              />
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        </CToaster>
      )}
    </AppContext.Provider>
  )
}

AppProvider.propTypes = {
  children: propTypes.node.isRequired,
}

export default AppProvider
