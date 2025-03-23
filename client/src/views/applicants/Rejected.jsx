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
  CTooltip,
} from '@coreui/react'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faEye, faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons'
import { formatDate } from '../../utils'

const Rejected = () => {
  const [applicants, setApplicants] = React.useState([
    {
      _id: 1,
      applicantName: 'John Doe',
      jobTitle: 'Software Developer',
      applicationDate: new Date(2024, 7, 1),
    },
    {
      _id: 2,
      applicantName: 'Jane Doe',
      jobTitle: 'Software Developer',
      applicationDate: new Date(2024, 7, 1),
    },
    {
      _id: 3,
      applicantName: 'John Smith',
      jobTitle: 'Software Developer',
      applicationDate: new Date(2024, 7, 1),
    },
  ])

  return (
    <>
      <CContainer>
        <CRow className="mb-3">
          <CCol>
            <h2>Rejected</h2>
            <small>
              In this page, you can view and edit the list of applicants which are rejected for the
              job.
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
                <CTable align="middle" hover responsive striped>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell className="text-center">#</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Applicant Name</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Job Title</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Application Date</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {applicants.map((applicant) => (
                      <CTableRow key={applicant._id}>
                        <CTableDataCell className="text-center">{applicant._id}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          {applicant.applicantName}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {applicant.jobTitle}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {formatDate(applicant.applicationDate, 'MMM DD, YYYY')}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CInputGroup>
                            <CTooltip content="Review" placement="top">
                              <CButton color="primary">
                                <FontAwesomeIcon icon={faEye} />
                              </CButton>
                            </CTooltip>
                            {/* <CTooltip content="Reject" placement="top">
                              <CButton color="danger">
                                <FontAwesomeIcon icon={faTrash} />
                              </CButton>
                            </CTooltip> */}
                          </CInputGroup>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
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

export default Rejected
