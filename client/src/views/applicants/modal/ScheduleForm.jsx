import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../../context/authContext'
import propTypes from 'prop-types'
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CButton,
  CBadge,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CCard,
  CCardBody,
  CTabs,
  CTab,
  CTabList,
  CTabContent,
  CTabPanel,
  CFormCheck,
  CAlert,
  CSpinner,
  CTooltip,
} from '@coreui/react'
import { date, set, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { get, post, put, del } from '../../../api/axios'
import { AppContext } from '../../../context/appContext'
import { formatDate, formatTime, trimString } from '../../../utils'
import { parse } from '@fortawesome/fontawesome-svg-core'
import { config } from '../../../config'

const Calendar = React.lazy(() => import('react-calendar'))

const ScheduleForm = ({ isVisible, onClose, isDarkMode, applicantData }) => {
  const { addToast } = useContext(AppContext)

  const [hasEvents, setHasEvents] = useState([])
  const [events, setEvents] = useState([])

  const [facilities, setFacilities] = useState([])
  const [selectedFacility, setSelectedFacility] = useState('')
  const [defaultDate, setDefaultDate] = useState(new Date())

  const [timeslots, setTimeslots] = useState([])
  const [isTimeslotLoading, setIsTimeslotLoading] = useState(false)

  const [isBookingLoading, setIsBookingLoading] = useState(false)

  const handleDateChange = (date) => {
    const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    setDefaultDate(formattedDate)
  }

  const getCalendarStates = async () => {
    try {
      const month = defaultDate.getMonth() + 1
      const year = defaultDate.getFullYear()
      const res = await get(
        `/facilities/events/${selectedFacility._id}/calendar-states?month=${month}&year=${year}`,
      )
      console.log('CALENDAR STATES', res.data.data)
      setHasEvents(res.data.data)
    } catch (error) {
      addToast('error', error.message, 'Error')
    }
  }

  const getAllFacilities = async () => {
    try {
      const res = await get('/facilities/all')
      // console.log(res.data)
      setFacilities(res.data.data)
    } catch (error) {
      addToast('error', error.message, 'Error')
    }
  }

  const getEventsForDate = async () => {
    try {
      const res = await get(`/facilities/events/${selectedFacility._id}/${defaultDate}`)
      console.log('EVENTS', res.data.data)
      if (res.status === 200) {
        setEvents(res.data.data)
      } else {
        setEvents([])
      }
    } catch (error) {
      addToast('error', error.message, 'Error')
    }
  }

  const handleBookApplicantToEvent = async (eventId) => {
    try {
      setIsBookingLoading(true)
      const res = await post(`/facilities/events/${eventId}/book/applicant/${applicantData._id}`)
      console.log('Response', res.data)
      if (res.status === 200 || res.status === 201) {
        addToast('Success', 'Applicant has been booked to the event', 'success')
        getEventsForDate()
      }
      setIsBookingLoading(false)
    } catch (error) {
      addToast('error', error.message, 'Error')
    }
  }

  useEffect(() => {
    if (selectedFacility) {
      if (defaultDate) {
        getEventsForDate()
      }
      getCalendarStates()
    }
    getAllFacilities()
  }, [selectedFacility, defaultDate])

  return (
    <>
      <CModal
        visible={isVisible}
        onClose={() => {
          onClose()
          setSelectedFacility('')
          setEvents([])
          setHasEvents([])
        }}
        size="xl"
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>
            Schedule an Event for {applicantData.firstname}, {applicantData.lastname}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CContainer>
              <CRow xs={{ cols: 1, gutter: 2 }} md={{ cols: 2, gutter: 4 }}>
                <CCol>
                  <CFormSelect>
                    <option value="">Select Facility</option>
                    {facilities.map((facility) => (
                      <option
                        key={facility._id}
                        value={facility._id}
                        onClick={() => {
                          setSelectedFacility(facility)
                          setDefaultDate(new Date())
                          setHasEvents([])
                        }}
                      >
                        {facility.name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol>
                  <p className="text-muted">
                    {selectedFacility ? (
                      <>
                        <strong>{selectedFacility.location} </strong>
                        <br />
                        {selectedFacility.description}
                      </>
                    ) : (
                      <span className="text-danger">*Please select a facility first.</span>
                    )}
                  </p>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CBadge color="warning">Has Events</CBadge>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <Calendar
                    onChange={handleDateChange}
                    className={isDarkMode ? 'calendar dark-mode' : 'calendar'}
                    defaultValue={new Date()}
                    tileClassName={({ date }) => {
                      const dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                        .toISOString()
                        .split('T')[0]
                      if (hasEvents.some((event) => event.startsWith(dateString))) {
                        return 'has-events'
                      }
                      return null
                    }}
                  />
                </CCol>
              </CRow>
              {config.env === 'development' && (
                <CRow>
                  <CCol className="text-muted d-flex gap-1" style={{ fontSize: '0.9rem' }}>
                    <span>
                      <strong>Applicant ID:</strong> {applicantData._id}
                    </span>
                    <span>
                      <strong>Facility ID:</strong> {selectedFacility._id}
                    </span>
                  </CCol>
                </CRow>
              )}
              <CRow>
                <CCol>
                  <CCard>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <CTable align="middle" hover responsive striped>
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell>Facilty</CTableHeaderCell>
                                <CTableHeaderCell>Type</CTableHeaderCell>
                                <CTableHeaderCell>Date</CTableHeaderCell>
                                <CTableHeaderCell>Time</CTableHeaderCell>
                                <CTableHeaderCell>Event</CTableHeaderCell>
                                <CTableHeaderCell>Capacity</CTableHeaderCell>
                                <CTableHeaderCell>Participants</CTableHeaderCell>
                                <CTableHeaderCell>Actions</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {events.length > 0 ? (
                                events.map((event) => (
                                  <CTableRow key={event._id}>
                                    <CTableDataCell>{selectedFacility.name}</CTableDataCell>
                                    <CTableDataCell>{selectedFacility.type}</CTableDataCell>
                                    <CTableDataCell>{formatDate(event.date)}</CTableDataCell>
                                    <CTableDataCell>
                                      {formatTime(event.timeslot.start)} -{' '}
                                      {formatTime(event.timeslot.end)}
                                    </CTableDataCell>
                                    <CTableDataCell>{event.name}</CTableDataCell>
                                    <CTableDataCell>{event.capacity}</CTableDataCell>
                                    <CTableDataCell>{event.participants.length}</CTableDataCell>
                                    <CTableDataCell>
                                      <div className="d-flex flex-row gap-2">
                                        {event.participants.some(
                                          (p) =>
                                            p.applicant.toString() === applicantData._id.toString(),
                                        ) ? (
                                          <CButton
                                            color="success"
                                            disabled
                                            className="text-white"
                                            size="sm"
                                            onClick={() => handleBookApplicantToEvent(event._id)}
                                          >
                                            Booked
                                          </CButton>
                                        ) : (
                                          <CButton
                                            color="info"
                                            className="text-white"
                                            size="sm"
                                            onClick={() => handleBookApplicantToEvent(event._id)}
                                          >
                                            {isBookingLoading ? (
                                              <CSpinner color="light" size="sm" />
                                            ) : (
                                              'Book'
                                            )}
                                          </CButton>
                                        )}
                                      </div>
                                    </CTableDataCell>
                                  </CTableRow>
                                ))
                              ) : (
                                <CTableRow>
                                  <CTableDataCell colSpan="12" className="text-center">
                                    No events available. Please select a date from the{' '}
                                    <span className="text-info">calendar</span>.
                                  </CTableDataCell>
                                </CTableRow>
                              )}
                            </CTableBody>
                          </CTable>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CContainer>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

ScheduleForm.propTypes = {
  isVisible: propTypes.bool.isRequired,
  isDarkMode: propTypes.bool,
  onClose: propTypes.func.isRequired,
  applicantData: propTypes.object,
}

export default ScheduleForm
