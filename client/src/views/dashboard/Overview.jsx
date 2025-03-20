import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CButton,
  CTooltip,
  CFormFeedback,
  CInputGroupText,
} from '@coreui/react'
import React from 'react'

const Overview = () => {
  return (
    <>
      <CContainer>
        <CRow>
          <CCol>
            <h1>Dashboard</h1>
            {/* <small className="text-muted text-danger">
							
						</small> */}
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <p className="text-danger">
              Page is still under construction. Please check back later.
            </p>
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default Overview
