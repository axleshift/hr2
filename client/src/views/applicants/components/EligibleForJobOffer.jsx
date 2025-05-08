import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CSpinner,
  CButton,
  CTooltip,
} from '@coreui/react'
import { formatDate, trimString } from '../../../utils'

const EligibleForJobOffer = ({ applicants = [], loading, onIssueOffer }) => {
  useEffect(() => {
    console.log('Applicants: ', applicants)
  }, [applicants])
  return (
    <>
      <h2>Eligible for Job Offer</h2>
      <CCard className="mb-4">
        <CCardBody>
          <CTable align="middle" hover responsive striped>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Applicant</CTableHeaderCell>
                <CTableHeaderCell>Position</CTableHeaderCell>
                <CTableHeaderCell>Preferred Location</CTableHeaderCell>
                <CTableHeaderCell>Interview Date</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {loading ? (
                <CTableRow>
                  <CTableDataCell colSpan="12">
                    <div className="d-flex justify-content-center">
                      <CSpinner variant="grow" size="sm" />
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ) : applicants.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan="12">
                    <div className="d-flex justify-content-center">
                      No eligible applicants found
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ) : (
                applicants.map((applicant) => (
                  <CTableRow key={applicant._id}>
                    <CTooltip content={applicant._id} placement="top">
                      <CTableDataCell>{trimString(applicant._id, 10)}</CTableDataCell>
                    </CTooltip>
                    <CTableDataCell>
                      {applicant.lastname}, {applicant.firstname}
                    </CTableDataCell>
                    <CTableDataCell>{applicant.jobAppliedFor || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{applicant.preferredWorkLocation || 'N/A'}</CTableDataCell>
                    <CTableDataCell>
                      {formatDate(applicant.interviewDate || applicant.updatedAt)}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="success" size="sm" onClick={() => onIssueOffer(applicant)}>
                        Issue Offer
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  )
}

EligibleForJobOffer.propTypes = {
  applicants: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onIssueOffer: PropTypes.func,
}

export default EligibleForJobOffer
