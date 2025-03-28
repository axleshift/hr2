import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CForm,
  CFormInput,
  CInputGroup,
  CButton,
} from '@coreui/react'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons'

const Training = () => {
  const [applicants, setApplicants] = useState([])

  return (
    <>
      <CContainer>
        <CRow className="mb-3">
          <CCol>
            <h2>Training</h2>
            <small>
              In this page, you can view and edit the list of applicants which needs training for
              the job, or is currently undergoing training.
            </small>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol>
            <CForm>
              <CInputGroup>
                <CFormInput type="search" placeholder="Search..." aria-label="Search" />
                <CButton type="button" color="primary">
                  <FontAwesomeIcon icon={faSearch} />
                </CButton>
                <CButton type="button" color="primary">
                  <FontAwesomeIcon icon={faRefresh} />
                </CButton>
              </CInputGroup>
            </CForm>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol>
            <CCard>
              <CCardBody>
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Applicant ID</CTableHeaderCell>
                      <CTableHeaderCell>Applicant Name</CTableHeaderCell>
                      <CTableHeaderCell>Job Title</CTableHeaderCell>
                      <CTableHeaderCell>Application Date</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {applicants.length <= 0 && (
                      <CTableRow>
                        <CTableDataCell colSpan="5" className="text-center">
                          No applicants found.
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default Training
