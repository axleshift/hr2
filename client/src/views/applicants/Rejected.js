import { CContainer, CRow, CCol } from '@coreui/react'
import React from 'react'

const Rejected = () => {
  return (
    <>
      <CContainer>
        <CRow>
          <CCol>
            <h2>Rejected</h2>
            <small>
              In this page, you can view and edit the list of applicants which are rejected for the
              job.
            </small>
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default Rejected
