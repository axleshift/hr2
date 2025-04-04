import React, { useEffect, useState } from 'react'
import propTypes from 'prop-types'

import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CContainer,
  CRow,
  CCol,
  CInputGroup,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CButton,
  CFormRange,
  CFormFeedback,
  CSpinner,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CTableFoot,
  CCardHeader,
  CCard,
  CCardBody,
  CCardFooter,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
  CListGroup,
  CListGroupItem,
  CTooltip,
  CFormText,
} from '@coreui/react'

import { get } from '../../../api/axios'
import { formatCurency, formatDate } from '../../../utils'

import AppPagination from '../../../components/AppPagination'

const Joboffers = ({ applicantId }) => {
  const [docs, setDocs] = useState([])
  const [joboffers, setJoboffers] = useState([])
  const [isJobofferLoading, setIsJobofferLoading] = useState(false)

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  const getHeaderColor = (index) => {
    return index % 2 === 0 ? '' : '#6c757d'
  }

  const getColor = (index) => {
    return index % 2 === 0 ? '' : 'white'
  }

  const getAllJoboffers = async (appId) => {
    try {
      setIsJobofferLoading(true)
      const res = await get(
        `/applicant/joboffer/all/${appId}?page=${currentPage}&limit=${itemsPerPage}&sort=desc`,
      )
      if (res.status === 200) {
        console.log('Job offers', JSON.stringify(res.data.data, null, 2))
        setJoboffers(res.data.data)
        setCurrentPage(res.data.currentPage)
        setTotalItems(res.data.totalItems)
        setTotalPages(res.data.totalPages)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsJobofferLoading(false)
    }
  }

  useEffect(() => {
    if (applicantId) {
      getAllJoboffers(applicantId)
    }
  }, [applicantId, currentPage, totalPages, totalItems])
  return (
    <>
      <CContainer className="mt-3 mb-3">
        <CRow className="mb-3">
          <CCol className="d-flex justify-content-end">
            <CButton
              color="primary"
              size="sm"
              onClick={() => getAllJoboffers(applicantId)}
              disabled={isJobofferLoading}
              className="w-25"
            >
              {isJobofferLoading ? (
                <>
                  <CSpinner size="sm" />
                  <span>Loading...</span>
                </>
              ) : (
                'Refresh'
              )}
            </CButton>
          </CCol>
        </CRow>
        {isJobofferLoading ? (
          <CRow>
            <CCol>
              <CSpinner size="sm" />
            </CCol>
          </CRow>
        ) : joboffers.length === 0 ? (
          <CRow>
            <CCol className="d-flex justify-content-center">No screenings found</CCol>
          </CRow>
        ) : (
          joboffers.map((job, index) => {
            return (
              <CRow key={job._id} className="mb-3">
                <CCol>
                  <CCard>
                    <CCardHeader
                      style={{ backgroundColor: getHeaderColor(index), color: getColor(index) }}
                      className="d-flex justify-content-between"
                    >
                      <div>Job Offer</div>
                      <div>
                        <small className="text-muted">{job._id}</small>
                      </div>
                    </CCardHeader>
                    <CCardBody>
                      <CForm>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput
                              label="Issued By"
                              readOnly
                              defaultValue={`${job.issuedBy.lastname}, ${job.issuedBy.firstname}`}
                            />
                          </CCol>
                          <CCol>
                            <CFormInput
                              label="Issued Date"
                              readOnly
                              defaultValue={formatDate(job.issuedDate, 'MMM DD YYYY h:mm A')}
                            />
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput
                              label="Position / Job Applied For"
                              readOnly
                              defaultValue={job.position}
                            />
                          </CCol>
                          <CCol>
                            <CFormInput label="Status" readOnly defaultValue={job.status} />
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput
                              label="Salary"
                              readOnly
                              defaultValue={formatCurency(job.salary)}
                            />
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormTextarea label="Benefits" readOnly defaultValue={job.benefits} />
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormTextarea label="Notes" readOnly defaultValue={job.notes} />
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput
                              label="Approved By"
                              readOnly
                              defaultValue={
                                job.approvedBy
                                  ? `${job.approvedBy.lastname}, ${job.approvedBy.firstname}`
                                  : 'No Data'
                              }
                            />
                          </CCol>
                          <CCol>
                            <CFormInput
                              label="Approved Date"
                              readOnly
                              defaultValue={
                                job.approvedDate ? formatDate(job.approvedDate) : 'No Data'
                              }
                            />
                          </CCol>
                        </CRow>
                      </CForm>
                    </CCardBody>
                    <CCardFooter className="d-flex justify-content-end">
                      <div className="d-flex gap-2 flex-row text-muted">
                        <small style={{ fontSize: '0.8rem' }}>
                          Created At: <span>{formatDate(job.createdAt, 'MMM DD YYYY h:mm A')}</span>
                        </small>
                        <small> | </small>
                        <small style={{ fontSize: '0.8rem' }}>
                          Updated At: <span>{formatDate(job.updatedAt, 'MMM DD YYYY h:mm A')}</span>
                        </small>
                      </div>
                    </CCardFooter>
                  </CCard>
                </CCol>
              </CRow>
            )
          })
        )}
        <CRow className="mt-2">
          <CCol>
            <div className="d-flex flex-row gap-2 justify-content-center align-items-center">
              <AppPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

Joboffers.propTypes = {
  applicantId: propTypes.string,
}

export default Joboffers
