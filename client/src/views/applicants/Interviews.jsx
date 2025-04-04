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
  CSpinner,
} from '@coreui/react'
import React, { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons'
import { get } from '../../api/axios'
import { formatDate, formatTime, trimString } from '../../utils'
import { AuthContext } from '../../context/authContext'

import EventForm from '../facility/modals/EventForm'
import InterviewForm from './modal/InterviewForm'

const Interviews = () => {
  const { userInformation } = useContext(AuthContext)
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [isUpcomingEventsLoading, setIsUpcomingEventsLoading] = useState(false)

  // Event form state
  const [isEventFormVisible, setIsEventFormVisible] = useState(false)
  const [eventFormState, setEventFormState] = useState('view')
  const [selectedSlot, setSelectedSlot] = useState({})

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  // Recent Interviews
  const [recentInterviews, setRecentIntervies] = useState([])
  const [isRecentInterviewsLoading, setRecentInterviewsLoading] = useState(false)
  const [rCurrentPage, setRCurrentPage] = useState(1)
  const [rItemsPerPage, setRItemsPerPage] = useState(9)
  const [rTotalPages, setRTotalPages] = useState(0)
  const [rTotalItems, setRTotalItems] = useState(0)

  // Interview Form
  const [isInterviewFormVisible, setIsInterviewFormVisible] = useState(false)
  const [interview, setInterview] = useState({})
  const [interviewFormState, setInterviewFormState] = useState('view')
  const [applicant, setApplicant] = useState({})
  const [event, setEvent] = useState({})

  const getAllUpcomingEvents = async () => {
    try {
      setIsUpcomingEventsLoading(true)
      const res = await get('/facilities/events/upcoming')
      console.log('Upcoming Events', res.data)
      if (res.status === 200) {
        setUpcomingEvents(res.data.data)
        setIsUpcomingEventsLoading(false)
      }
    } catch (error) {
      setIsUpcomingEventsLoading(false)
      console.error(error)
    }
  }

  const getAllRecentInterviews = async () => {
    try {
      setRecentInterviewsLoading(true)
      const res = await get('/applicant/interview/recent')
      console.log('recent', JSON.stringify(res.data))
      if (res.status === 200) {
        setRecentIntervies(res.data.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setRecentInterviewsLoading(false)
    }
  }

  const DEBOUNCE_DELAY = 500
  useEffect(() => {
    const handler = setTimeout(() => {
      getAllUpcomingEvents()
      getAllRecentInterviews()
    }, DEBOUNCE_DELAY)
    return () => clearTimeout(handler)
  }, [currentPage, totalPages, totalItems])

  return (
    <>
      <CContainer>
        <CRow className="mb-3">
          <CCol>
            <h2>Interviews & Other Events</h2>
            <small>
              In this page, you can <span className="text-info">view</span> and{' '}
              <span className="text-warning">edit</span> the list of upcoming interviews and events.
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
                <CButton
                  type="button"
                  color="primary"
                  onClick={() => {
                    getAllUpcomingEvents()
                  }}
                >
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
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Event</CTableHeaderCell>
                      <CTableHeaderCell>Author</CTableHeaderCell>
                      <CTableHeaderCell>Type</CTableHeaderCell>
                      <CTableHeaderCell>Date</CTableHeaderCell>
                      <CTableHeaderCell>Timeslot</CTableHeaderCell>
                      <CTableHeaderCell>Participants</CTableHeaderCell>
                      <CTableHeaderCell>Approved</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {isUpcomingEventsLoading ? (
                      <CTableRow>
                        <CTableDataCell colSpan="12">
                          <div className="d-flex justify-content-center">
                            <CSpinner variant="grow" size="sm" />
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ) : upcomingEvents.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="12">
                          <div className="d-flex justify-content-center">
                            No upcoming events found
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      upcomingEvents.map((event) => (
                        <CTableRow key={event._id}>
                          <CTooltip placement="top" content={event._id}>
                            <CTableDataCell>{trimString(event._id, 10)}</CTableDataCell>
                          </CTooltip>
                          <CTableDataCell>{event.name}</CTableDataCell>
                          <CTableDataCell>
                            {event.author.lastname}, {event.author.firstname}
                          </CTableDataCell>
                          <CTableDataCell>{event.type}</CTableDataCell>
                          <CTableDataCell>{formatDate(event.date)}</CTableDataCell>
                          <CTableDataCell>
                            {formatTime(event.timeslot?.start)} - {formatTime(event.timeslot?.end)}{' '}
                            {/* Fixed duplicate time */}
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex justify-content-center">
                              {event.participants?.length}
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            {event.isApproved.status ? (
                              <span className="text-success">Approved</span>
                            ) : (
                              <small className="text-danger">Requires Approval</small>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex gap-2 flex-row">
                              <CButton
                                color="info"
                                size="sm"
                                onClick={() => {
                                  setEventFormState('view')
                                  setIsEventFormVisible(true)
                                  setSelectedSlot(event.timeslot)
                                }}
                              >
                                View
                              </CButton>
                              {(userInformation.role === 'admin' ||
                                userInformation.role === 'manager') && (
                                <CButton
                                  color="warning"
                                  size="sm"
                                  onClick={() => {
                                    setEventFormState('edit')
                                    setIsEventFormVisible(true)
                                    setSelectedSlot(event.timeslot)
                                  }}
                                >
                                  Manage
                                </CButton>
                              )}
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
        <hr />
        <CRow>
          <CCol>
            <h2>Recent Interviews</h2>
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
                      <CTableHeaderCell>Applicant</CTableHeaderCell>
                      <CTableHeaderCell>Interviewer</CTableHeaderCell>
                      <CTableHeaderCell>Type</CTableHeaderCell>
                      <CTableHeaderCell>Date</CTableHeaderCell>
                      <CTableHeaderCell>Recommendation</CTableHeaderCell>
                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {isRecentInterviewsLoading ? (
                      <CTableRow>
                        <CTableDataCell colSpan="12">
                          <div className="d-flex justify-content-center">
                            <CSpinner variant="grow" size="sm" />
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ) : recentInterviews.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="12">
                          <div className="d-flex justify-content-center">
                            No recent interviews found
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      recentInterviews.map((rec) => {
                        return (
                          <CTableRow key={rec._id}>
                            <CTooltip placement="top" content={rec._id}>
                              <CTableDataCell>{trimString(rec._id, 10)}</CTableDataCell>
                            </CTooltip>
                            <CTableDataCell>
                              {rec.applicant.lastname}, {rec.applicant.firstname}
                            </CTableDataCell>
                            <CTableDataCell>
                              {rec.interviewer.lastname}, {rec.interviewer.firstname}
                            </CTableDataCell>
                            <CTableDataCell>{rec.type}</CTableDataCell>
                            <CTableDataCell>{formatDate(rec.date)}</CTableDataCell>
                            <CTableDataCell className="text-capitalize">
                              {rec.recommendation}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                color="warning"
                                size="sm"
                                onClick={() => {
                                  setInterview(rec)
                                  setInterviewFormState('view')
                                  setIsInterviewFormVisible(true)
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
        <CRow>
          <CCol>
            <EventForm
              isVisible={isEventFormVisible}
              onClose={() => {
                setEventFormState('view')
                setIsEventFormVisible(false)
                getAllUpcomingEvents()
                getAllRecentInterviews()
              }}
              state={eventFormState}
              slot={selectedSlot}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <InterviewForm
              isVisible={isInterviewFormVisible}
              onClose={() => setIsInterviewFormVisible(false)}
              state={interviewFormState}
              interview={interview}
            />
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default Interviews
