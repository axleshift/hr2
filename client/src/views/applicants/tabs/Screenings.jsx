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
import { formatDate } from '../../../utils'

import AppPagination from '../../../components/AppPagination'

const Screenings = ({ applicantId }) => {
  const [docs, setDocs] = useState([])
  const [screenings, setScreenings] = useState([])
  const [isScreeningLoading, setIsScreeningLoading] = useState(false)

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

  const getAllScreenings = async (appId) => {
    try {
      setIsScreeningLoading(true)
      const res = await get(
        `/applicant/screen/all/${appId}?page=${currentPage}&limit=${itemsPerPage}&sort=desc`,
      )
      if (res.status === 200) {
        console.log('Screenings', JSON.stringify(res.data.data, null, 2))
        setScreenings(res.data.data)
        setCurrentPage(res.data.currentPage)
        setTotalItems(res.data.totalItems)
        setTotalPages(res.data.totalPages)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsScreeningLoading(false)
    }
  }

  useEffect(() => {
    if (applicantId) {
      getAllScreenings(applicantId)
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
              onClick={() => getAllScreenings(applicantId)}
              disabled={isScreeningLoading}
              className="w-25"
            >
              {isScreeningLoading ? (
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
        {isScreeningLoading ? (
          <CRow>
            <CCol>
              <CSpinner size="sm" />
            </CCol>
          </CRow>
        ) : screenings.length === 0 ? (
          <CRow>
            <CCol className="d-flex justify-content-center">No screenings found</CCol>
          </CRow>
        ) : (
          screenings.map((scr, index) => {
            return (
              <CRow key={scr._id} className="mb-3">
                <CCol>
                  <CCard>
                    <CCardHeader
                      style={{ backgroundColor: getHeaderColor(index), color: getColor(index) }}
                    >
                      Screening
                    </CCardHeader>
                    <CCardBody>
                      <CForm>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput
                              label="Interviewer"
                              readOnly
                              defaultValue={`${scr.reviewer.lastname}, ${scr.reviewer.firstname}`}
                            />
                          </CCol>
                          <CCol>
                            <CFormInput
                              label="Date"
                              readOnly
                              defaultValue={formatDate(scr.createdAt)}
                            />
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput
                              label="Status"
                              readOnly
                              defaultValue={scr.status}
                              className="text-capitalize"
                            />
                          </CCol>
                          <CCol>
                            <CFormInput
                              label="Job"
                              readOnly
                              defaultValue={scr.job?.name ? scr.job.name : 'Null'}
                            />
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput
                              label="Recommendation"
                              readOnly
                              defaultValue={scr.recommendation}
                              className="text-capitalize"
                            />
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol>
                            <h5>Analysis</h5>
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormTextarea
                              label="Summary"
                              readOnly
                              rows={6}
                              defaultValue={scr.aiAnalysis.summary}
                            />
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput
                              type="number"
                              label="Experience"
                              readOnly
                              defaultValue={scr.aiAnalysis.scoreBreakdown.experience}
                            />
                          </CCol>
                          <CCol>
                            <CFormInput
                              type="number"
                              label="Education"
                              readOnly
                              defaultValue={scr.aiAnalysis.scoreBreakdown.education}
                            />
                          </CCol>
                          <CCol>
                            <CFormInput
                              type="number"
                              label="Skills"
                              readOnly
                              defaultValue={scr.aiAnalysis.scoreBreakdown.skills}
                            />
                          </CCol>
                          <CCol>
                            <CFormInput
                              type="number"
                              label="Motivation"
                              readOnly
                              defaultValue={scr.aiAnalysis.scoreBreakdown.motivation}
                            />
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol>
                            <CFormTextarea
                              label="Comments"
                              readOnly
                              rows={6}
                              defaultValue={scr.aiAnalysis.comments}
                            />
                          </CCol>
                        </CRow>
                      </CForm>
                    </CCardBody>
                    <CCardFooter className="d-flex justify-content-end">
                      <div className="d-flex gap-2 flex-row text-muted">
                        <small style={{ fontSize: '0.8rem' }}>
                          Created At: <span>{formatDate(scr.createdAt, 'MMM DD YYYY h:mm A')}</span>
                        </small>
                        <small> | </small>
                        <small style={{ fontSize: '0.8rem' }}>
                          Updated At: <span>{formatDate(scr.updatedAt, 'MMM DD YYYY h:mm A')}</span>
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

Screenings.propTypes = {
  applicantId: propTypes.string,
}

export default Screenings
