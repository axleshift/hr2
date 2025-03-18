import React, { useState, useEffect, useContext } from 'react'
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
  CInputGroup,
  CFormInput,
  CFormTextarea,
  CButton,
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CTabs,
  CTab,
  CTabList,
  CTabContent,
  CTabPanel,
  CAlert,
  CBadge,
  CTooltip,
  CSpinner,
} from '@coreui/react'
import { set, z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { del, get, post } from '../../../api/axios'
import { Calendar } from 'react-calendar'
import { AppContext } from '../../../context/appContext'
import { formatDate } from '../../../utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import EventForm from './EventForm'
import { trimString } from '../../../utils/index'

const ManageFacilityForm = ({ isVisible, onClose, facilityData = {}, onChange }) => {
  const { addToast } = useContext(AppContext)

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false)

  // Calendar state
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [defaultDate, setDefaultDate] = useState(new Date())
  const [isDismissed, setIsDismissed] = useState(false)
  const [hasSlots, setHasSlots] = useState([])

  // timeslot
  const [timeslots, setTimeslots] = useState([])
  const [isTimeslotLoading, setIsTimeslotLoading] = useState(false)
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)
  const [isRemoveLoading, setIsRemoveLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState({})

  // Event state
  const [Events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEventFormVisible, setIsEventFormVisible] = useState(false)
  const [isEventEdit, setIsEventEdit] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState({})
  const [isEventSubmitLoading, setIsEventSubmitLoading] = useState(false)

  // Counter state
  const [milliseconds, setMilliseconds] = useState(5000)
  const [timeleft, setTimeleft] = useState(0)

  const formatTime = (timeString, format = '12h') => {
    const [hours, minutes] = timeString.split(':')
    const hour = hours % 12 || 12
    const modifier = hours < 12 ? 'AM' : 'PM'
    return `${hour}:${minutes} ${modifier}`
  }

  const handleDateChange = (date) => {
    const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    setDefaultDate(formattedDate)
  }

  const parseCalendarStates = () => {
    const dates = facilityData.timeslots.map((slot) => new Date(slot.date))
    const hasSlots = dates.map(
      (date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000),
    )
    console.log(hasSlots)
    setHasSlots(hasSlots)
  }

  const getAllTimeslotsForDate = async () => {
    try {
      setIsTimeslotLoading(true)
      const res = await get(`/facilities/timeslot/${facilityData._id}/${new Date(defaultDate)}`)
      console.log(res.data)
      if (res.status === 200) {
        setIsTimeslotLoading(false)
        return setTimeslots(res.data.data)
      }
    } catch (error) {
      setIsTimeslotLoading(false)
      console.error(error)
      addToast('error', 'An error occurred while fetching timeslots', 'danger')
    }
  }

  const timeslotSchema = z
    .object({
      start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format, must be HH:MM'),
      end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format, must be HH:MM'),
    })
    .superRefine((data, ctx) => {
      if (data.start >= data.end) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Start time must be before end time',
          path: ['start'], // This will highlight the 'start' field
        })
      }
      // Check for overlapping timeslots
      const overlappingSlot = timeslots.find(
        (slot) => data.start < slot.end && data.end > slot.start,
      )
      if (overlappingSlot) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Timeslot overlaps with an existing one',
          path: ['start'], // This will highlight the 'start' field
        })
      }
    })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(timeslotSchema),
  })

  const handleTimeslotSubmit = async (data) => {
    try {
      setIsSubmitLoading(true)
      const formdata = new FormData()
      formdata.append('date', new Date(defaultDate))
      formdata.append('start', data.start)
      formdata.append('end', data.end)

      const res = await post(`/facilities/timeslot/create/${facilityData._id}`, formdata)
      if (res.status === 404) {
        setIsSubmitLoading(false)
        return addToast('error', JSON.stringify(res.message.message), 'danger')
      }
      if (res.status === 400) {
        setIsSubmitLoading(false)
        return addToast('error', JSON.stringify(res.message.message), 'danger')
      }
      onChange()
      getAllTimeslotsForDate()
      setIsSubmitLoading(false)
      return addToast('success', 'Timeslot added successfully', 'success')
    } catch (error) {
      console.error(error)
      setIsSubmitLoading(false)
      addToast('error', 'An error occurred while adding timeslot', 'danger')
    }
  }

  const handleTimeSlotRemove = async (timeslot) => {
    try {
      setIsRemoveLoading(true)
      const res = await del(`/facilities/timeslot/delete/${timeslot._id}`)
      if (res.status === 200) {
        setIsRemoveLoading(false)
        getAllTimeslotsForDate()
        return addToast('success', 'Timeslot removed successfully', 'success')
      }
      setIsRemoveLoading(false)
      getAllTimeslotsForDate()
      return addToast('error', 'Failed to remove timeslot', 'danger')
    } catch (error) {
      console.error(error)
      addToast('error', 'An error occurred while removing timeslot', 'danger')
    }
  }

  useEffect(() => {
    if (isVisible) {
      setIsModalVisible(isVisible)
      onChange()
      parseCalendarStates()
      getAllTimeslotsForDate()
    }
  }, [defaultDate, isVisible])

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CModal
            visible={isModalVisible}
            onClose={() => {
              setIsModalVisible(false)
              setHasSlots([])
              onChange()
              onClose()
              reset()
            }}
            size="lg"
            backdrop="static"
          >
            <CModalHeader>
              <CModalTitle>Manage {facilityData.name || 'Facility'}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CTabs activeItemKey={0}>
                <CTabList variant="underline-border">
                  <CTab itemKey={0}>Timeslots</CTab>
                  <CTab itemKey={1}>Events</CTab>
                </CTabList>
                <CTabContent>
                  <CTabPanel itemKey={0}>
                    <CContainer>
                      <CRow className="mb-3">
                        <CCol>
                          <Calendar
                            onChange={handleDateChange}
                            className={isDarkMode ? 'calendar dark-mode' : 'calendar'}
                            defaultValue={defaultDate}
                            tileClassName={({ date }) => {
                              if (
                                hasSlots.find((slot) => slot.toDateString() === date.toDateString())
                              ) {
                                return 'has-timeslots'
                              }
                            }}
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol>
                          Manage timeslots for{' '}
                          <span className="text-info">{formatDate(defaultDate)}</span>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol>
                          <CForm onSubmit={handleSubmit(handleTimeslotSubmit)}>
                            <CRow className="d-flex gap-2">
                              <CCol>
                                <CFormInput
                                  type="time"
                                  {...register('start')}
                                  placeholder="Start time"
                                  invalid={!!errors.start}
                                />
                                {errors.start && (
                                  <div className="invalid-feedback">{errors.start.message}</div>
                                )}
                              </CCol>
                              <CCol>
                                <CFormInput
                                  type="time"
                                  {...register('end')}
                                  placeholder="End time"
                                  invalid={!!errors.end}
                                />
                                {errors.end && (
                                  <div className="invalid-feedback">{errors.end.message}</div>
                                )}
                              </CCol>
                              <CCol>
                                <div className="d-flex justify-content-end">
                                  {isSubmitLoading ? (
                                    <CButton color="primary" disabled>
                                      <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                      ></span>
                                      &nbsp;Adding...
                                    </CButton>
                                  ) : (
                                    <CButton color="primary" type="submit">
                                      Add
                                    </CButton>
                                  )}
                                </div>
                              </CCol>
                            </CRow>
                          </CForm>
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol>
                          <CCard>
                            <CCardBody>
                              <CTable align="middle" hover responsive striped>
                                <CTableHead>
                                  <CTableRow>
                                    <CTableHeaderCell>#</CTableHeaderCell>
                                    <CTableHeaderCell>Date</CTableHeaderCell>
                                    <CTableHeaderCell>Start</CTableHeaderCell>
                                    <CTableHeaderCell>End</CTableHeaderCell>
                                    <CTableHeaderCell>Availability</CTableHeaderCell>
                                    <CTableHeaderCell>Action</CTableHeaderCell>
                                  </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                  {timeslots.length === 0 ? (
                                    <CTableRow>
                                      <CTableDataCell colSpan="6" className="text-center">
                                        No timeslots found for {formatDate(defaultDate)}
                                      </CTableDataCell>
                                    </CTableRow>
                                  ) : (
                                    timeslots.map((slot) => (
                                      <CTableRow key={slot._id}>
                                        <CTableDataCell>
                                          <CTooltip content={slot._id} placement="top">
                                            <span className="text-muted">
                                              {trimString(slot._id, 10)}
                                            </span>
                                          </CTooltip>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {formatDate(new Date(slot.date))}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {formatTime(slot.start, '12h')}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {formatTime(slot.end, '12h')}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {slot.isAvailable ? (
                                            <span className="text-success">Available</span>
                                          ) : (
                                            <span className="text-danger">Booked</span>
                                          )}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          <CInputGroup>
                                            <CButton
                                              color="danger"
                                              size="sm"
                                              onClick={() => handleTimeSlotRemove(slot)}
                                            >
                                              {isRemoveLoading ? <CSpinner size="sm" /> : 'Delete'}
                                            </CButton>
                                            {slot.isAvailable ? (
                                              <CButton
                                                color="info"
                                                size="sm"
                                                onClick={() => {
                                                  setSelectedSlot(slot)
                                                  setIsEventFormVisible(true)
                                                  setIsModalVisible(false)
                                                  setIsEventEdit(true)
                                                }}
                                              >
                                                Edit Event
                                              </CButton>
                                            ) : (
                                              <CButton
                                                color="info"
                                                size="sm"
                                                onClick={() => {
                                                  setSelectedSlot(slot)
                                                  setIsEventFormVisible(true)
                                                  setIsModalVisible(false)
                                                }}
                                              >
                                                Set Event
                                              </CButton>
                                            )}
                                          </CInputGroup>
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
                    </CContainer>
                  </CTabPanel>
                  <CTabPanel itemKey={1}>events</CTabPanel>
                </CTabContent>
              </CTabs>
            </CModalBody>
          </CModal>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <EventForm
            isVisible={isEventFormVisible}
            onClose={() => {
              setIsEventFormVisible(false)
              setIsModalVisible(true)
            }}
            isEdit={isEventEdit}
            eventData={selectedEvent}
            slot={selectedSlot}
          />
        </CCol>
      </CRow>
    </CContainer>
  )
}

ManageFacilityForm.propTypes = {
  isVisible: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
  facilityData: propTypes.object,
  onChange: propTypes.func,
}

export default ManageFacilityForm
