import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CBadge,
  CForm,
  CFormInput,
  CInputGroup,
  CTooltip,
  CFormFeedback,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CFormLabel,
  CFormSelect,
  CFormCheck,
  CFormSwitch,
} from '@coreui/react'

import React, { useContext, useEffect } from 'react'
import propTypes from 'prop-types'
import { AppContext } from '../../../context/appContext'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { del, get, post, put } from '../../../api/axios'
import { config } from '../../../config'
import { formatTime } from '../../../utils'
import { AuthContext } from '../../../context/authContext'

const EventForm = ({ isVisible, onClose, slot, state }) => {
  const { addToast } = useContext(AppContext)
  const { userInformation } = useContext(AuthContext)
  const [eventData, setEvenData] = React.useState({})
  const [isEventLoading, setIsEventLoading] = React.useState(false)
  const [eventFormState, setEventFormState] = React.useState('view')
  const [isReadOnly, setIsReadOnly] = React.useState(true)
  const [eventTypes, setEventTypes] = React.useState([
    'Initial Interview',
    'Final Interview',
    'Other',
  ])

  const [isSubmitLoading, setIsSubmitLoading] = React.useState(false)
  const [isRemoveLoading, setIsRemoveLoading] = React.useState(false)
  const [isEmailSentLoading, setIsEmailSentLoading] = React.useState(false)

  const [failedMails, setFailedMails] = React.useState([])

  const getEventData = async () => {
    try {
      setIsEventLoading(true)
      const res = await get(`/facilities/event/${slot.event}`)
      console.log('Event:', JSON.stringify(res.data.data, null, 2))
      if (res.status === 200) {
        setEvenData(res.data.data)
        formReset(res.data.data)
        setIsEventLoading(false)
        return addToast('Success', 'Event Fetched', 'success')
      }
    } catch (error) {
      console.error(error)
      addToast('error', 'failed to load event data', 'danger')
    }
  }

  const EventSchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string().optional(),
    capacity: z.number().int().positive(),
    type: z.enum(eventTypes, {
      errorMap: () => ({ message: 'Invalid Event Type' }),
    }),
    isApproved: z
      .union([z.boolean(), z.object({ status: z.boolean() })])
      .transform((val) => (typeof val === 'boolean' ? val : val.status))
      .default(false),
  })

  const {
    register,
    watch,
    handleSubmit,
    reset: formReset,
    formState: { errors },
    setValue,
  } = useForm({
    // resolver: zodResolver(EventSchema),
    resolver: async (data, context, options) => {
      const result = await zodResolver(EventSchema)(data, context, options)
      console.log('Validation result:', result)
      return result
    },
    defaultValues: eventData.isApproved?.status ?? false,
  })

  const isApproved = watch('isApproved', eventData.isApproved?.status)

  const handleEventSubmit = async (data) => {
    try {
      setIsSubmitLoading(true)
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('capacity', data.capacity)
      formData.append('type', data.type)
      formData.append('isApproved', data.isApproved)
      // const res = isEdit
      //   ? await put(`facilities/event/timeslot/${slot._id}`, data)
      //   : await post(`facilities/event/timeslot/${slot._id}`, data)
      let res
      switch (eventFormState) {
        case 'edit':
          res = await put(`/facilities/event/${slot._id}`, data)
          break
        default:
          res = await post(`/facilities/event/${slot._id}`, data)
          break
      }
      console.log('Submit Event', JSON.stringify(res.data.data, null, 2))
      if (res.status === 201) {
        setIsSubmitLoading(false)
        onClose()
        return addToast('success', 'Event created!', 'success')
      }
      if (res.status === 200) {
        setIsSubmitLoading(false)
        onClose()
        return addToast('success', 'Event updated!', 'success')
      }
      setIsSubmitLoading(false)
      onClose()
      return addToast('Error', 'Failed to create event', 'error')
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteEvent = async () => {
    try {
      const res = await del(`/facilities/event/${slot._id}`)
      if (res.status === 200) {
        handleResetForm()
        onClose()
        return addToast('Success', 'Event deleted!', 'success')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleResetForm = () => {
    formReset({
      name: '',
      description: '',
      capacity: 1,
      type: '',
      isApproved: false,
    })
  }

  const handleMockData = () => {
    const randNum = Math.floor(Math.random() * 100)
    const mockData = {
      name: `Event ${randNum}`,
      description: `This is a mock description for event #${randNum}`,
      capacity: Math.floor(Math.random() * 100) + 1,
    }
    formReset(mockData)
  }

  const removeApplicantFromEvent = async (applicant) => {
    try {
      setIsRemoveLoading(true)
      console.log(applicant._id)
      const formData = new FormData()
      formData.append('applicantId', applicant._id)
      const res = await del(
        `/facilities/events/${eventData._id}/unbook?applicantId=${applicant._id}`,
      )
      if (res.status === 200) {
        getEventData()
        setIsRemoveLoading(false)
        return addToast('Success', 'Applicant removed from the event', 'success')
      }
      setIsRemoveLoading(false)
      return addToast('Info', res.message.message, 'info')
    } catch (error) {
      console.error(error)
      addToast('Error', 'An error occured', 'danger')
    }
  }

  const handleSendEmail = async () => {
    try {
      setIsEmailSentLoading(true)
      const res = await post(`/facilities/events/${eventData._id}/send-email`)
      console.log('Send Email', JSON.stringify(res?.data, null, 2))
      if (res.status === 200) {
        setIsEmailSentLoading(false)
        setFailedMails(res.data.failedMails)
        return addToast(
          'Success',
          `Email sent for participant for event ${eventData.name}`,
          'success',
        )
      }
      setIsEmailSentLoading(false)
      return addToast('Info', res.message.message, 'info')
    } catch (error) {
      console.error(error)
      addToast('Error', 'An error occured', 'danger')
    }
  }

  useEffect(() => {
    if (isVisible) {
      setEventFormState(state)
      if (state === 'view' || state === 'edit') {
        getEventData()
      }
    }
  }, [isVisible, state])

  useEffect(() => {
    console.log(eventFormState)
    switch (eventFormState) {
      case 'edit':
        setIsReadOnly(false)
        break

      case 'create':
        setIsReadOnly(false)
        break

      default:
        setIsReadOnly(true)
        break
    }
  }, [eventFormState])

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CModal
            visible={isVisible}
            onClose={() => {
              handleResetForm()
              onClose()
              setEvenData({})
              setEventFormState('view')
              setIsReadOnly(false)
            }}
            size="xl"
          >
            <CModalHeader>
              <CModalTitle>
                {eventFormState === 'edit' || eventFormState === 'create'
                  ? 'Manage Event'
                  : 'View Event'}
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CContainer>
                <CRow className="mb-3">
                  <CCol className="d-flex flex-column">
                    <strong>
                      {formatTime(slot.start)} - {formatTime(slot.end)}
                    </strong>
                    <small className="text-muted"> Timeslot ID: {slot._id}</small>
                    {eventData && <small className="text-muted"> Event ID: {eventData._id}</small>}
                    {config.env === 'development' && (
                      <small className="text-muted"> Form State: {eventFormState}</small>
                    )}
                  </CCol>
                </CRow>
                {isEventLoading ? (
                  <CRow>
                    <CCol>
                      <CSpinner size="sm"></CSpinner>
                    </CCol>
                  </CRow>
                ) : (
                  <>
                    <CRow>
                      <CCol>
                        <CForm onSubmit={handleSubmit(handleEventSubmit)}>
                          <CRow className="mb-3">
                            <CCol>
                              <CFormInput
                                type="text"
                                label="Name"
                                placeholder="Applicant Interview"
                                {...register('name')}
                                readOnly={isReadOnly}
                                invalid={errors.name}
                              />
                              {errors.name && (
                                <CFormFeedback invalid className="text-danger">
                                  {errors.name.message}
                                </CFormFeedback>
                              )}
                            </CCol>
                          </CRow>
                          <CRow className="mb-3">
                            <CCol>
                              <CFormTextarea
                                type="text"
                                label="Description"
                                placeholder="Lorem ipsum..."
                                rows={6}
                                {...register('description')}
                                invalid={errors.description}
                                readOnly={isReadOnly}
                              />
                              {errors.description && (
                                <CFormFeedback invalid className="text-danger">
                                  {errors.description.message}
                                </CFormFeedback>
                              )}
                            </CCol>
                          </CRow>
                          <CRow className="mb-3">
                            <CCol>
                              <CFormInput
                                type="number"
                                label="Capacity"
                                placeholder="1"
                                defaultValue={1}
                                {...register('capacity', { valueAsNumber: true })}
                                readOnly={isReadOnly}
                                invalid={errors.capacity}
                              />
                              {errors.capacity && (
                                <CFormFeedback invalid className="text-danger">
                                  {errors.capacity.message}
                                </CFormFeedback>
                              )}
                            </CCol>
                          </CRow>
                          <CRow className="mb-3">
                            <CCol>
                              <CFormLabel htmlFor="type">Event Type</CFormLabel>
                              <CFormSelect
                                id="type"
                                {...register('type')}
                                invalid={!!errors.type}
                                disabled={isReadOnly}
                              >
                                <option value="">Select an event type</option>
                                {eventTypes.map((eventType) => (
                                  <option key={eventType} value={eventType}>
                                    {eventType}
                                  </option>
                                ))}
                              </CFormSelect>
                              {errors.type && (
                                <CFormFeedback invalid className="text-danger">
                                  {errors.type.message}
                                </CFormFeedback>
                              )}
                            </CCol>
                          </CRow>
                          <CRow className="mb-3">
                            <CCol>
                              <CFormLabel htmlFor="isApproved">
                                Current approval status:{' '}
                                {eventData.isApproved ? (
                                  <span className="text-success">Approved</span>
                                ) : (
                                  <span className="text-danger">Not approved</span>
                                )}
                              </CFormLabel>
                              <CFormSwitch
                                id="isApproved"
                                label={`${isApproved ? 'Approved' : 'Not Approved'}`}
                                {...register('isApproved', { valueAsBoolean: true })}
                                disabled={
                                  (userInformation.role === 'admin' ||
                                    userInformation.role === 'manager') &&
                                  isReadOnly
                                }
                              />
                            </CCol>
                          </CRow>
                          <CRow className="mb-3">
                            <CCol>
                              {(eventFormState === 'edit' || eventFormState === 'create') && (
                                <div className="d-flex justify-content-end gap-2">
                                  <CButton
                                    type="button"
                                    color="warning"
                                    size="sm"
                                    onClick={handleMockData}
                                  >
                                    Fill Mock Data
                                  </CButton>
                                  <CButton
                                    color="danger"
                                    size="sm"
                                    onClick={() => handleDeleteEvent()}
                                  >
                                    Delete
                                  </CButton>
                                  <CButton type="submit" color="primary" size="sm">
                                    {isSubmitLoading ? <CSpinner /> : 'Submit'}
                                  </CButton>
                                </div>
                              )}
                            </CCol>
                          </CRow>
                        </CForm>
                      </CCol>
                    </CRow>
                    {eventData.participants && (
                      <>
                        <CRow>
                          <CCol>
                            <CCard>
                              <CCardHeader>
                                <div className="d-flex justify-content-between">
                                  <div>Participants</div>
                                  {(userInformation.role === 'admin' ||
                                    userInformation.role === 'recruiter') &&
                                    eventFormState === 'edit' &&
                                    eventData.participants.length > 0 && (
                                      <div>
                                        <CButton
                                          size="sm"
                                          color="info"
                                          disabled={isEmailSentLoading}
                                          onClick={() => handleSendEmail()}
                                        >
                                          {isEmailSentLoading ? (
                                            <span>
                                              <CSpinner size="sm" /> sending...
                                            </span>
                                          ) : eventData.emailSent.status ? (
                                            'Resend Mail to Participants'
                                          ) : (
                                            'Send Mail to Participants'
                                          )}
                                        </CButton>
                                      </div>
                                    )}
                                </div>
                              </CCardHeader>
                              <CCardBody>
                                <CTable align="middle" hover responsive striped>
                                  <CTableHead>
                                    <CTableRow>
                                      {/* <CTableHeaderCell>#</CTableHeaderCell> */}
                                      <CTableHeaderCell>Name</CTableHeaderCell>
                                      <CTableHeaderCell>Email</CTableHeaderCell>
                                      <CTableHeaderCell>Phone</CTableHeaderCell>
                                      <CTableHeaderCell>Email Sent</CTableHeaderCell>
                                      <CTableHeaderCell>Action</CTableHeaderCell>
                                    </CTableRow>
                                  </CTableHead>
                                  <CTableBody>
                                    {eventData.participants.map((p) => {
                                      return (
                                        <CTableRow key={p.applicant._id}>
                                          {/* <CTableDataCell>{participant._id}</CTableDataCell> */}
                                          <CTableDataCell>
                                            {p.applicant.lastname}, {p.applicant.firstname}
                                          </CTableDataCell>
                                          <CTableDataCell>{p.applicant.email}</CTableDataCell>
                                          <CTableDataCell>{p.applicant.phone}</CTableDataCell>
                                          <CTableDataCell>
                                            {console.log(p.mail)}
                                            {p.mail.sent ? (
                                              <span className="text-success">Sent</span>
                                            ) : (
                                              <span className="text-danger">Failed</span>
                                            )}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {eventFormState === 'edit' ||
                                            eventFormState === 'create' ? (
                                              <CButton
                                                size="sm"
                                                color="danger"
                                                onClick={() =>
                                                  removeApplicantFromEvent(p.applicant)
                                                }
                                                disabled={isRemoveLoading}
                                              >
                                                {isRemoveLoading ? (
                                                  <CSpinner size="sm" />
                                                ) : (
                                                  'Remove'
                                                )}
                                              </CButton>
                                            ) : (
                                              <CButton size="sm" color="danger" disabled>
                                                No Permissions
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
                      </>
                    )}
                  </>
                )}
              </CContainer>
            </CModalBody>
          </CModal>
        </CCol>
      </CRow>
    </CContainer>
  )
}

EventForm.propTypes = {
  isVisible: propTypes.bool,
  onClose: propTypes.func,
  state: propTypes.string,
  slot: propTypes.object,
}

export default EventForm
