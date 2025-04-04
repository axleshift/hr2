import React, { useContext, useEffect, useState } from 'react'
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
} from '@coreui/react'

import { get } from '../../../api/axios'
import { formatCurency, formatDate } from '../../../utils'
import JobOfferForm from '../modal/JobOfferForm'
import AppPagination from '../../../components/AppPagination'
import { AuthContext } from '../../../context/authContext'

const Interviews = ({ applicantId }) => {
  const { userInformation } = useContext(AuthContext)
  const [docs, setDocs] = useState([])
  const [interviews, setInterviews] = useState([])
  const [isInterviewLoading, setIsInterviewLoading] = useState(false)

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  // job offer form state
  const [jobofferFormState, setJobofferFormState] = useState('view')
  const [jobofferFormIsVisible, setJobofferFormIsVisible] = useState(false)

  const getHeaderColor = (index) => {
    return index % 2 === 0 ? '' : '#6c757d'
  }

  const getColor = (index) => {
    return index % 2 === 0 ? '' : 'white'
  }

  const getAllInterviews = async (appId) => {
    try {
      setIsInterviewLoading(true)
      const res = await get(
        `/applicant/interview/all/${appId}?page=${currentPage}&limit=${itemsPerPage}&sort=desc`,
      )
      if (res.status === 200) {
        console.log('Interviews', JSON.stringify(res.data.data, null, 2))
        setInterviews(res.data.data)
        setCurrentPage(res.data.currentPage)
        setTotalItems(res.data.totalItems)
        setTotalPages(res.data.totalPages)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsInterviewLoading(false)
    }
  }

  useEffect(() => {
    if (applicantId) {
      getAllInterviews(applicantId)
    }
  }, [applicantId, currentPage, totalPages, totalItems])
  return (
    <>
      <CContainer className="mt-3 mb-3">
        <CRow className="mb-3">
          <CCol className="d-flex justify-content-end gap-2">
            <CButton
              color="primary"
              size="sm"
              onClick={() => getAllInterviews(applicantId)}
              disabled={isInterviewLoading}
              className="w-25"
            >
              {isInterviewLoading ? (
                <>
                  <CSpinner size="sm" />
                  <span>Loading...</span>
                </>
              ) : (
                'Refresh'
              )}
            </CButton>
            {/* {['admin', 'manager', 'recruiter'].includes(userInformation.role) && (
              <CButton
                color="warning"
                size="sm"
                disabled={isInterviewLoading || interviews.length === 0}
                onClick={() => {
                  setJobofferFormIsVisible(true)
                  setJobofferFormState('create')
                }}
              >
                {isInterviewLoading ? (
                  <>
                    <CSpinner size="sm" />
                    <span>Loading...</span>
                  </>
                ) : (
                  'Issue Job Offer'
                )}
              </CButton>
            )} */}
          </CCol>
        </CRow>
        {isInterviewLoading ? (
          <CRow>
            <CCol>
              <CSpinner size="sm" />
            </CCol>
          </CRow>
        ) : interviews.length === 0 ? (
          <CRow>
            <CCol className="d-flex justify-content-center">No interviews found</CCol>
          </CRow>
        ) : (
          interviews.map((int, index) => {
            return (
              <CRow key={int._id} className="mb-3">
                <CCol>
                  <CCard>
                    <CCardHeader
                      style={{ backgroundColor: getHeaderColor(index), color: getColor(index) }}
                      className="d-flex justify-content-between"
                    >
                      <div>Interview </div>
                      <div>
                        <small className="text-muted">{int._id}</small>
                      </div>
                    </CCardHeader>
                    <CCardBody>
                      <CForm>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput
                              label="Interviewer"
                              readOnly
                              defaultValue={`${int.interviewer.lastname}, ${int.interviewer.firstname}`}
                            />
                          </CCol>
                          <CCol>
                            <CFormInput label="Date" readOnly defaultValue={formatDate(int.date)} />
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput label="Type" readOnly defaultValue={int.type} />
                          </CCol>
                          <CCol>
                            <CFormInput
                              label="Event Type"
                              readOnly
                              defaultValue={int.event?.type ? int.event.type : 'Null'}
                            />
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol>
                            <h5>General Scores</h5>
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput
                              type="number"
                              label="Communication"
                              readOnly
                              defaultValue={int.general.communication}
                            />
                          </CCol>
                          <CCol>
                            <CFormInput
                              type="number"
                              label="Technical"
                              readOnly
                              defaultValue={int.general.technical}
                            />
                          </CCol>
                          <CCol>
                            <CFormInput
                              type="number"
                              label="Problem Solving"
                              readOnly
                              defaultValue={int.general.problemSolving}
                            />
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput
                              type="number"
                              label="Cultural Fit"
                              readOnly
                              defaultValue={int.general.culturalFit}
                            />
                          </CCol>
                          <CCol>
                            <CFormInput
                              type="number"
                              label="Work Experience Relevance"
                              readOnly
                              defaultValue={int.general.workExperienceRelevance}
                            />
                          </CCol>
                          <CCol>
                            <CFormInput
                              type="number"
                              label="leadership"
                              readOnly
                              defaultValue={int.general.leadership}
                            />
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol>
                            <h5>Questions</h5>
                          </CCol>
                        </CRow>
                        {int.questions.length === 0 ? (
                          <CRow>
                            <CCol>No Questions found</CCol>
                          </CRow>
                        ) : (
                          int.questions.map((q, index) => {
                            return (
                              <CRow key={index} className="mb-3">
                                <CCol>
                                  <CFormTextarea
                                    label={`Question #${index + 1}`}
                                    readOnly
                                    defaultValue={q.question}
                                  />
                                </CCol>
                                <CCol>
                                  <CFormTextarea
                                    label={`Remark #${index + 1}`}
                                    readOnly
                                    defaultValue={q.remark}
                                  />
                                </CCol>
                              </CRow>
                            )
                          })
                        )}
                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput
                              label="Salary Expectation"
                              readOnly
                              defaultValue={
                                int.salaryExpectation
                                  ? formatCurency(parseInt(int.salaryExpectation))
                                  : 'No data'
                              }
                            />
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormTextarea label="Strength" readOnly defaultValue={int.strength} />
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormTextarea label="Weakness" readOnly defaultValue={int.weakness} />
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormTextarea
                              label="Final Comments"
                              readOnly
                              defaultValue={int.finalComments}
                            />
                          </CCol>
                        </CRow>
                      </CForm>
                    </CCardBody>
                    <CCardFooter className="d-flex justify-content-end">
                      <div className="d-flex gap-2 flex-row text-muted">
                        <small style={{ fontSize: '0.8rem' }}>
                          Created At: <span>{formatDate(int.createdAt, 'MMM DD YYYY h:mm A')}</span>
                        </small>
                        <small> | </small>
                        <small style={{ fontSize: '0.8rem' }}>
                          Updated At: <span>{formatDate(int.updatedAt, 'MMM DD YYYY h:mm A')}</span>
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
        {/* <CRow>
          <CCol>
            <JobOfferForm
              isVisible={jobofferFormIsVisible}
              onClose={() => {
                setJobofferFormIsVisible(false)
                setJobofferFormState('view')
              }}
              state={jobofferFormState}
              applicantId={applicantId}
            />
          </CCol>
        </CRow> */}
      </CContainer>
    </>
  )
}

Interviews.propTypes = {
  applicantId: propTypes.string,
}

export default Interviews
