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
import React, { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons'
import { get } from '../../api/axios'
import { formatDate, formatTime, trimString } from '../../utils'
import { AuthContext } from '../../context/authContext'

import EventForm from '../facility/modals/EventForm'

const Interviews = () => {
  const { userInformation } = useContext(AuthContext)
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [isUpcomingEventsLoading, setIsUpcomingEventsLoading] = useState(false)

  // Event form state
  const [isEventFormVisible, setIsEventFormVisible] = useState(false)
  const [eventFormState, setEventFormState] = useState('view')
  const [selectedSlot, setSelectedSlot] = useState({})

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
      console.error(error)
    }
  }

  useEffect(() => {
    getAllUpcomingEvents()
  }, [])
  return (
    <>
      <CContainer>
        <CRow className="mb-3">
          <CCol>
            <h2>Interviews</h2>
            <small>In this page, you can view and edit the list of upcoming interviews.</small>
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
                    {upcomingEvents.map((event) => {
                      return (
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
                            {formatTime(event.timeslot.start)} - {formatTime(event.timeslot.start)}
                          </CTableDataCell>
                          <CTableDataCell>{event.participants.length}</CTableDataCell>
                          <CTableDataCell>
                            {event.isApproved.status ? (
                              <span className="text-success">Approved</span>
                            ) : (
                              <small className="text-danger">Requires Approval</small>
                            )}
                          </CTableDataCell>
                          <CTableDataCell className="d-flex gap-2 flex-wrap">
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
                              // eslint-disable-next-line prettier/prettier
                                  <CButton color="warning" size="sm" onClick={() => {
                                  setEventFormState('edit')
                                  setIsEventFormVisible(true)
                                  setSelectedSlot(event.timeslot)
                                }}
                              >
                                Manage
                              </CButton>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })}
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
                setEventFormState(false)
                setIsEventFormVisible(false)
              }}
              state={eventFormState}
              slot={selectedSlot}
            />
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default Interviews
