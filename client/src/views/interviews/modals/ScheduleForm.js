import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CButton,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormTextarea,
  CFormCheck,
  CFormFeedback,
  CContainer,
  CRow,
  CCol,
  CTooltip,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormLabel,
  CBadge,
} from '@coreui/react'
import Calendar from 'react-calendar'
import TimeModal from './TimeForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faClock,
  faPenClip,
  faPlus,
  faCheck,
  faXmark,
  faTrash,
  faListNumeric,
} from '@fortawesome/free-solid-svg-icons'

import { del, get, post, put } from '../../../api/axios'

import React, { useEffect, useState, useContext } from 'react'
import propTypes, { object } from 'prop-types'
import { date, set, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { convertTimeStringTo12Hour, formattedDate, formattedDateMMM, UTCDate } from '../../../utils'
import { AppContext } from '../../../context/appContext'

const ScheduleForm = ({ isVisible, onClose, isDarkMode, interviewData }) => {
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
  const { addToast } = useContext(AppContext)
  const [defaultDate, setDefaultDate] = useState(UTCDate(new Date()))
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [dateData, setDateData] = useState({})
  const [monthData, setMonthData] = useState({})

  const [slotID, setSlotID] = useState('')
  const [allSlots, setAllSlots] = useState([])
  const [availableSlots, setAvailableSlots] = useState([])

  const [timeModalVisible, setTimeModalVisible] = useState(false)
  const [selectedTime, setSelectedTime] = useState(null)

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalPages, setTotalPages] = useState(1)

  const formSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    date: z.preprocess(
      (value) => new Date(value),
      z.date().min(yesterday, { message: 'Date should be today or later' }),
    ),
    timeslotId: z.string().optional(),
    start: z.string().min(1, { message: 'Start time is required' }),
    end: z.string().min(1, { message: 'End time is required' }),
    location: z.string().optional(),
    capacity: z.preprocess(
      (value) => parseInt(value),
      z.number().min(1, { message: 'Capacity should be at least 1' }),
    ),
    additionalInfo: z.string().optional(),
  })
  // notify if time is not available

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    // resolver: zodResolver(formSchema),
    // debug
    resolver: async (data, context, options) => {
      const result = await zodResolver(formSchema)(data, context, options)
      console.log('Validation result:', result)
      return result
    },
  })

  const timeSchema = z
    .object({
      start: z.string().min(1, { message: 'Start time is required' }),
      end: z.string().min(1, { message: 'End time is required' }),
    })
    .refine(
      async (data) => {
        const [statHours, startMinutes] = data.start.split(':').map(Number)
        const [endHours, endMinutes] = data.end.split(':').map(Number)

        // convert times to minutes for comparison
        const startTime = statHours * 60 + startMinutes
        const endTime = endHours * 60 + endMinutes

        // check if start time is before end time
        return startTime < endTime
      },
      {
        message: 'Start time should be before end time',
        path: ['start'],
      },
    )

  const {
    register: timeRegister,
    handleSubmit: timeHandleSubmit,
    formState: { errors: timeErrors },
  } = useForm({
    // resolver: zodResolver(timeSchema),

    resolver: async (data, context, options) => {
      const result = await zodResolver(timeSchema)(data, context, options)
      console.log('Validation result:', result)
      return result
    },
  })

  const getAllSlotsForDate = async (date) => {
    try {
      console.info('getAllSlotsForDate -> date', date)
      const res = await get(`/interview/slots?date=${date}`)
      if (res.status === 200) {
        const data = res.data
        setAllSlots(data.data)
        const available = data.data.filter((slot) => slot.isAvailable)
        setAvailableSlots(available)
      } else {
        addToast('Error', 'Failed to fetch time slots', 'danger')
      }
    } catch (error) {
      console.error(error)
      // empty the slots
      setAllSlots([])
      setAvailableSlots([])
    }
  }

  const handleTimeSubmit = async (timeslot) => {
    try {
      const date = defaultDate
      console.log(date, timeslot)
      const data = {
        date,
        timeslot: {
          start: timeslot.start,
          end: timeslot.end,
        },
      }
      const res = await post(`/interview/slots/`, data)
      console.log('res', res)
      if (res.status === 200 || res.status === 201) {
        addToast('Success', 'Time slot added successfully', 'success')
        getAllSlotsForDate(defaultDate)
      } else {
        addToast('Error', res.message.message, 'danger')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteTimeslot = async (timeId) => {
    try {
      const res = await del(`/interview/slot/${timeId}`)
      console.log("handleDeleteTimeslot -> Result", res)
      if (res.status === 200) {
        addToast('Success', 'Time slot deleted successfully', 'success')
        getAllSlotsForDate(defaultDate)
      } else {
        addToast('Error', 'Something went wrong. Unable to delete time slot.', 'danger')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleFormSubmit = (data) => {
    try {
      const formdata = {
        date: defaultDate,
        title: data.title,
        timeslotRef_id: data.timeslotId,
        additionalInfo: data.additionalInfo,
        location: data.location,
        capacity: data.capacity,
      }
      console.log(formdata)
      const res = !isEdit
        ? post(`/interview/schedule`, formdata)
        : put(`/interview/schedule/${interviewData._id}`, formdata)
      if (res.status === 200) {
        addToast('Success', 'Interview scheduled successfully', 'success')
        handleOnClose()
      } else {
        addToast('Error', 'Failed to schedule interview', 'danger')
      }
    } catch (error) {
      addToast('Error', 'Failed to schedule interview', 'danger')
      console.error(error)
    }
  }

  const handleDateChange = (date) => {
    setDefaultDate(new Date(date))
  }

  const handleOnClose = () => {
    reset({
      applicantId: '',
      applicantName: '',
      date: new Date(),
      start: null,
      end: null,
    })
    onClose()
  }

  const handleTimeModalClose = () => {
    setTimeModalVisible(false)
  }

  useEffect(() => {
    getAllSlotsForDate(new Date(defaultDate))
  }, [defaultDate])

  useEffect(() => {
    if (interviewData) {
      console.log('Scheduled Interview', interviewData)
      setIsEdit(true)
      setDefaultDate(new Date(interviewData.date))
      reset({
        title: interviewData.title,
        timeslotId: interviewData.timeslot._id,
        start: convertTimeStringTo12Hour(interviewData.timeslot.start),
        end: convertTimeStringTo12Hour(interviewData.timeslot.end),
        location: interviewData.location,
        additionalInfo: interviewData.additionalInfo,
      })
    }
  }, [interviewData])

  return (
    <>
      <CModal visible={isVisible} onClose={handleOnClose} size="lg">
        <CModalHeader>
          <CModalTitle>{isEdit ? 'Edit Interview' : 'Schedule Interview'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-5">
            <Calendar
              onChange={handleDateChange} // Fix here
              defaultValue={defaultDate}
              className={isDarkMode ? 'calendar dark-mode' : 'calendar'}
            />
          </div>
          <CForm onSubmit={handleSubmit(handleFormSubmit)}>
            <CRow>
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FontAwesomeIcon icon={faUser} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    placeholder="Title"
                    {...register('title')}
                    invalid={!!errors.title}
                  />
                </CInputGroup>
                {errors.title && <CFormFeedback invalid>{errors.title.message}</CFormFeedback>}
              </CCol>
            </CRow>
            {!allSlots || allSlots.length === 0 ? (
              <CRow className="text-danger">
                <CCol>
                  <CFormLabel>Click a Date to view its timeslot, if none.. add one.</CFormLabel>
                </CCol>
              </CRow>
            ) : (
              <>
                <CRow>
                  <CCol>
                    <CFormLabel>Time Slots</CFormLabel>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol className="d-flex flex-wrap gap-2 justify-content-start">
                    {allSlots.map((time, index) => (
                      <div key={index} className="mb-3">
                        <CBadge color={time.isAvailable ? 'success' : 'danger'}>
                          {convertTimeStringTo12Hour(time.start)} -{' '}
                          {convertTimeStringTo12Hour(time.end)}{' '}
                          <CTooltip
                            content={time.isAvailable ? 'Available' : 'Not Available'}
                            placement="top"
                          >
                            <FontAwesomeIcon icon={time.isAvailable ? faCheck : faXmark} />
                          </CTooltip>
                          <CTooltip content="Delete Time Slot" placement="top">
                            <CButton onClick={() => handleDeleteTimeslot(time._id)} className="btn">
                              <FontAwesomeIcon icon={faTrash} />
                            </CButton>
                          </CTooltip>
                        </CBadge>
                      </div>
                    ))}
                  </CCol>
                </CRow>
              </>
            )}
            <CRow>
              <CCol className="d-flex justify-content-end align-items-center">
                <CTooltip content="Add Time Slot" placement="top">
                  <CButton
                    onClick={() => setTimeModalVisible(true)}
                    className="btn btn-success mb-3"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </CButton>
                </CTooltip>
              </CCol>
            </CRow>
            <CRow>
              <CCol md={4}>
                <CInputGroup className="mb-3">
                  <CInputGroupText>Date</CInputGroupText>
                  <CFormInput
                    type="text"
                    {...register('date')}
                    invalid={!!errors.date}
                    value={formattedDate(defaultDate)}
                    readOnly
                    className="visually-hidden"
                  />
                  <CFormInput
                    type="text"
                    invalid={!!errors.date}
                    value={formattedDateMMM(defaultDate)}
                    readOnly
                  />
                  {errors.date && <CFormFeedback invalid>{errors.date.message}</CFormFeedback>}
                </CInputGroup>
              </CCol>
              <CCol md={8}>
                {/* Dropdown */}
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FontAwesomeIcon icon={faClock} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    placeholder="Time"
                    readOnly
                    {...register('start')}
                    invalid={!!errors.start}
                  />
                  {errors.start && <CFormFeedback invalid>{errors.start.message}</CFormFeedback>}
                  <CFormInput
                    type="text"
                    placeholder="Time"
                    readOnly
                    {...register('end')}
                    invalid={!!errors.end}
                  />
                  {errors.end && <CFormFeedback invalid>{errors.end.message}</CFormFeedback>}
                  <CTooltip content="Set Time Slot" placement="top">
                    <CDropdown>
                      <CDropdownToggle color="primary">Time</CDropdownToggle>
                      <CDropdownMenu>
                        {availableSlots.map((time, index) => (
                          <CDropdownItem
                            key={index}
                            onClick={() => {
                              setSelectedTime(time)
                              reset({
                                timeslotId: time._id,
                                start: convertTimeStringTo12Hour(time.start),
                                end: convertTimeStringTo12Hour(time.end),
                              })
                            }}
                            disabled={availableSlots.length === 0}
                          >
                            {convertTimeStringTo12Hour(time.start)} -{' '}
                            {convertTimeStringTo12Hour(time.end)}
                          </CDropdownItem>
                        ))}
                      </CDropdownMenu>
                    </CDropdown>
                  </CTooltip>
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FontAwesomeIcon icon={faUser} />
                  </CInputGroupText>
                  <CFormInput
                    type="text"
                    placeholder="Location"
                    {...register('location')}
                    invalid={!!errors.location}
                  />
                  {errors.location && (
                    <CFormFeedback invalid>{errors.location.message}</CFormFeedback>
                  )}
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FontAwesomeIcon icon={faListNumeric} />
                  </CInputGroupText>
                  <CFormInput
                    type="number"
                    placeholder="capacity"
                    {...register('capacity')}
                    invalid={!!errors.capacity}
                    defaultValue={1}
                  />
                  {errors.capacity && (
                    <CFormFeedback invalid>{errors.capacity.message}</CFormFeedback>
                  )}
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <FontAwesomeIcon icon={faPenClip} />
                  </CInputGroupText>
                  <CFormTextarea
                    type="text"
                    placeholder="Additional Information"
                    {...register('additionalInfo')}
                    invalid={!!errors.additionalInfo}
                  />
                  {errors.additionalInfo && (
                    <CFormFeedback invalid>{errors.additionalInfo.message}</CFormFeedback>
                  )}
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow>
              {/* confirmation checkbox */}
              <CCol className="d-flex justify-content-end">
                <CFormCheck
                  type="checkbox"
                  id="invalidCheck"
                  label="I confirm everything is correct."
                  checked={isConfirmed}
                  onChange={() => setIsConfirmed(!isConfirmed)}
                />
                <CFormFeedback invalid>You must agree before submitting.</CFormFeedback>
              </CCol>
            </CRow>
            <CModalFooter>
              <CButton type="submit" disabled={!isConfirmed} className="btn btn-primary">
                {isEdit ? 'Update' : 'Schedule'}
              </CButton>
              <CButton color="secondary" onClick={handleOnClose}>
                Cancel
              </CButton>
            </CModalFooter>
          </CForm>
        </CModalBody>
      </CModal>
      <TimeModal
        isVisible={timeModalVisible}
        onClose={handleTimeModalClose}
        handleTimeSubmit={handleTimeSubmit}
      />
    </>
  )
}

ScheduleForm.propTypes = {
  isVisible: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
  isDarkMode: propTypes.bool.isRequired,
  interviewData: propTypes.object,
}

export default ScheduleForm
