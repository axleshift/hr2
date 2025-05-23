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
  CBadge,
  CTooltip,
  CSpinner,
} from '@coreui/react'
import React, { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh, faSearch, faUndo, faUser, faUserClock } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '../../context/appContext'
import { get } from '../../api/axios'
import ScheduleForm from './modal/ScheduleForm'
import { trimString } from '../../utils'
import AppPagination from '../../components/AppPagination'

const Shortlisted = () => {
  const { addToast } = useContext(AppContext)

  // data states
  const [applicants, setApplicants] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedApplicantData, setSelectedApplicantData] = useState({})

  // search state
  const [searchInput, setSearchInput] = useState('')
  const [isSearchMode, setIsSearchMode] = useState(false)

  // tags
  const [formtags, setFormtags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  const [isScheduleFormVisible, setIsScheduleFormVisible] = useState(false)

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  // Modal form states
  const [isAppFormVisible, setIsAppFormVisible] = useState(false)

  const getAllData = async () => {
    try {
      setIsLoading(true)
      const res = await get('/applicant/category/shortlisted')
      console.log(res.data)
      if (res.status === 200) {
        setApplicants(res.data.data)
        setIsLoading(false)
      } else {
        setApplicants([])
      }
    } catch (error) {
      addToast('Error', error, 'danger')
    } finally {
      setIsLoading(false)
      setCurrentPage(1)
      setTotalItems(0)
      setTotalPages(0)
    }
  }

  const getAllTags = async () => {
    try {
      const category = 'applicant'
      const res = await get(`/tags/category/${category}`)

      if (res.status === 200) {
        console.log(res.data)
        setFormtags(res.data.data)
      } else {
        addToast('Error', 'An error occurred', 'danger')
      }
    } catch (error) {
      addToast('Error', 'An error occurred', 'danger')
    }
  }

  useEffect(() => {
    getAllData()
    getAllTags()
  }, [])

  return (
    <>
      <CContainer>
        <CRow className="mb-3">
          <CCol>
            <h2>Shortlisted</h2>
            <small>
              In this page, you can <span className="text-info">view</span> and{' '}
              <span className="text-danger">remove</span> applicants from being qualified for the
              job. As well as{' '}
              <span className="text-primary">schedule an APPLICANT for an interview</span>.
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
                <CButton type="button" color="primary" onClick={() => getAllData()}>
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
                      <CTableHeaderCell>
                        <strong>#</strong>
                      </CTableHeaderCell>
                      <CTableHeaderCell>
                        <FontAwesomeIcon icon={faUser} />
                      </CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>Phone</CTableHeaderCell>
                      <CTableHeaderCell>Tags</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {isLoading ? (
                      <CTableRow>
                        <CTableDataCell colSpan="6">
                          <CSpinner size="sm" />
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      applicants.map((app, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{trimString(app._id, 10)}</CTableDataCell>
                          <CTableDataCell>
                            {app.lastname}, {app.firstname}
                          </CTableDataCell>
                          <CTableDataCell>{app.email}</CTableDataCell>
                          <CTableDataCell>{app.phone}</CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex flex-wrap">
                              {app.tags.map((tag, index) => {
                                const tagName = formtags.find(
                                  (formTag) => formTag._id === tag,
                                )?.name
                                return (
                                  <CBadge
                                    key={index}
                                    shape="rounded-pill"
                                    color="primary"
                                    className="me-1 mb-1"
                                  >
                                    {tagName}
                                  </CBadge>
                                )
                              })}
                              {app.statuses.journey.isShortlisted && (
                                <CBadge shape="rounded-pill" color="success" className="me-1 mb-1">
                                  Shortlisted
                                </CBadge>
                              )}

                              {app.statuses.journey.isInitialInterview && (
                                <CBadge shape="rounded-pill" color="success" className="me-1 mb-1">
                                  Initial Interview
                                </CBadge>
                              )}

                              {app.statuses.journey.isTechnicalInterview && (
                                <CBadge shape="rounded-pill" color="success" className="me-1 mb-1">
                                  Technical Interview
                                </CBadge>
                              )}

                              {app.statuses.journey.isPanelInterview && (
                                <CBadge shape="rounded-pill" color="success" className="me-1 mb-1">
                                  Panel Interview
                                </CBadge>
                              )}

                              {app.statuses.journey.isBehavioralInterview && (
                                <CBadge shape="rounded-pill" color="success" className="me-1 mb-1">
                                  Behavioral Interview
                                </CBadge>
                              )}

                              {app.statuses.journey.isFinalInterview && (
                                <CBadge shape="rounded-pill" color="success" className="me-1 mb-1">
                                  Final Interview
                                </CBadge>
                              )}

                              {app.statuses.journey.isJobOffer && (
                                <CBadge shape="rounded-pill" color="success" className="me-1 mb-1">
                                  Job Offered
                                </CBadge>
                              )}
                              {app.statuses.journey.isHired && (
                                <CBadge shape="rounded-pill" color="success" className="me-1 mb-1">
                                  Initial Interview
                                </CBadge>
                              )}
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex gap-2">
                              <CTooltip content="Remove from list" placement="top">
                                <CButton color="danger" size="sm">
                                  <FontAwesomeIcon icon={faUndo} />
                                </CButton>
                              </CTooltip>
                              <CTooltip content="Schedule an interview" placement="top">
                                <CButton
                                  color="info"
                                  size="sm"
                                  onClick={() => {
                                    // setIsAppFormVisible(true)
                                    setIsScheduleFormVisible(true)
                                    setSelectedApplicantData(app)
                                  }}
                                >
                                  <FontAwesomeIcon icon={faUserClock} />
                                </CButton>
                              </CTooltip>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          {/* <CCol>
            <ApplicantForm
              isVisible={isAppFormVisible}
              onClose={() => setIsAppFormVisible(false)}
              isDarkMode={true}
              applicantData={selectedApplicantData}
            />
          </CCol> */}
        </CRow>
        <CRow>
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
            <ScheduleForm
              isVisible={isScheduleFormVisible}
              onClose={() => setIsScheduleFormVisible(false)}
              isDarkMode={true}
              applicantData={selectedApplicantData}
            />
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default Shortlisted
