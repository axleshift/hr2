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
  CSpinner,
  CTooltip,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons'
import { get } from '../../api/axios'
import { formatDate, trimString } from '../../utils'

import JobForm from '../job/modals/JobForm'
import JobOfferForm from './modal/JobOfferForm'
import AppPagination from '../../components/AppPagination'

const Joboffers = () => {
  const [joboffers, setJoboffers] = useState([])

  const [isJobofferLoading, setIsJobofferLoading] = useState(false)

  // job offer form state
  const [jobofferFormState, setJobofferFormState] = useState('view')
  const [jobofferFormIsVisible, setJobofferFormIsVisible] = useState(false)
  const [jobOffer, setJoboffer] = useState({})

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  const getAllJoboffers = async () => {
    try {
      setIsJobofferLoading(true)
      const res = await get(
        `/applicant/joboffer/recent?page=${currentPage}&limit=${itemsPerPage}&sort=desc`,
      )

      if (res.status === 200) {
        setJoboffers(res.data.data)
        setCurrentPage(res.data.currentPage)
        setTotalPages(res.data.totalPages)
        setTotalItems(res.data.totalItems)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsJobofferLoading(false)
    }
  }

  useEffect(() => {
    getAllJoboffers()
  }, [currentPage, itemsPerPage, totalPages, totalItems])

  return (
    <>
      <CContainer>
        <CRow className="mb-3">
          <CCol>
            <h2>Joboffers</h2>
            <small>
              In this page, you can view Job offers for applicants that needs approval by a manager.
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
                  <FontAwesomeIcon icon={faRefresh} onClick={() => getAllJoboffers()} />
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
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Applicant Name</CTableHeaderCell>
                      <CTableHeaderCell>Position</CTableHeaderCell>
                      <CTableHeaderCell>Start Date</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Issued By</CTableHeaderCell>
                      <CTableHeaderCell>Issued Date</CTableHeaderCell>
                      <CTableHeaderCell>Approved By</CTableHeaderCell>
                      <CTableHeaderCell>Approved Date</CTableHeaderCell>
                      <CTableHeaderCell>Email Sent</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {isJobofferLoading ? (
                      <CTableRow>
                        <CTableDataCell colSpan="12">
                          <div className="d-flex justify-content-center">
                            <CSpinner variant="grow" size="sm" />
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ) : joboffers.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="12">
                          <div className="d-flex justify-content-center">No job offer found</div>
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      joboffers.map((joboffer) => {
                        return (
                          <CTableRow key={joboffer._id}>
                            <CTooltip placement="top" content={joboffer._id}>
                              <CTableDataCell>{trimString(joboffer._id, 10)}</CTableDataCell>
                            </CTooltip>
                            <CTableDataCell>
                              {joboffer.applicant?.lastname}, {joboffer.applicant?.firstname}
                            </CTableDataCell>
                            <CTableDataCell>{joboffer.position}</CTableDataCell>
                            <CTableDataCell>
                              {formatDate(joboffer.startDate, 'MMM DD YYYY h:mm A')}
                            </CTableDataCell>
                            <CTableDataCell>{joboffer.status}</CTableDataCell>
                            <CTableDataCell>
                              {joboffer.issuedBy?.lastname}, {joboffer.issuedBy?.firstname}
                            </CTableDataCell>
                            <CTableDataCell>
                              {formatDate(joboffer.issuedDate, 'MMM DD YYYY h:mm A')}
                            </CTableDataCell>
                            <CTableDataCell>
                              {joboffer.approvedBy
                                ? `${joboffer.approvedBy.lastname}, ${joboffer.approvedBy.firstname}`
                                : 'No Data'}
                            </CTableDataCell>
                            <CTableDataCell>
                              {joboffer.approvedDate
                                ? formatDate(joboffer.approvedDate, 'MMM DD YYYY h:m A')
                                : 'No Data'}
                            </CTableDataCell>
                            <CTableDataCell>
                              {joboffer.emailsent ? (
                                <span className="text-success">Sent</span>
                              ) : (
                                <span className="text-danger">Not Sent</span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                color="warning"
                                size="sm"
                                onClick={() => {
                                  setJoboffer(joboffer)
                                  setJobofferFormIsVisible(true)
                                  setJobofferFormState('edit')
                                }}
                              >
                                Manage
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        )
                      })
                    )}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
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
        <CRow>
          <CCol>
            <JobOfferForm
              isVisible={jobofferFormIsVisible}
              onClose={() => {
                setJobofferFormIsVisible(false)
              }}
              state={jobofferFormState}
              joboffer={jobOffer}
            />
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default Joboffers
