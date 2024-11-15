import React from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CButton,
} from '@coreui/react'

const Page404 = () => {

  const goBack = () => {
    window.history.back()
  }

  return (
    <div className="min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">404</h1>
              <h4>Oops! You{"'"}re lost.</h4>
              <p className="text-body-secondary float-start">
                The page you are looking for was not found.
              </p>
            </div>
          </CCol>
        </CRow>
        <CRow  className='d-flex justify-content-center'>
          <CCol md={6}>
            <CButton onClick={goBack} className='btn btn-link'>
              <span>Go back</span>
            </CButton>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page404
