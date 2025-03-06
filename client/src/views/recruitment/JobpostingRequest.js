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

const JobpostingRequest = () => {
  return (
    <>
      <CContainer>
        <CRow>
          <CCol>
            <h1>Jobposting Request</h1>
            <small className="text-muted">
              In this page, you can request a jobposting for your company. All the request displayed
              here come from competencies management.
            </small>
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default JobpostingRequest
