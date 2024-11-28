import { CContainer, CRow, CCol } from '@coreui/react'
import React from 'react'

const Screening = () => {
  return (
    <>
      <CContainer>
        <CRow>
          <CCol>
            <h2>Screening</h2>
            <small>
              In this page, you can view and edit the list of applicants which needs screening for
              the job, and is waiting for the HR to review their application.
            </small>
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default Screening
