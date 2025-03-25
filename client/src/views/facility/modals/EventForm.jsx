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
import { get, post, put } from '../../../api/axios'
import { config } from '../../../config'
import { formatTime } from '../../../utils'

const EventForm = ({ isVisible, onClose, slot, state }) => {
  const { addToast } = useContext(AppContext)
  const [eventData, setEvenData] = React.useState({})
  const [isEventLoading, setIsEventLoading] = React.useState(false)
  const [eventFormState, setEventFormState] = React.useState('view')
  const [isReadOnly, setIsReadOnly] = React.useState(true)
  const [eventTypes, setEventTypes] = React.useState([
    'Initial Interview',
    'Final Interview',
    'Other',
  ])

  const [isLoading, setIsLoading] = React.useState(false)

  const getEventData = async (params) => {
    try {
      setIsEventLoading(true)
      const res = await get(`/facilities/event/${slot.event}`)
      console.log('Event:', res.data.data)
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
    isApproved: z.boolean().default(false),
  })

  const {
    register,
    watch,
    handleSubmit,
    reset: formReset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(EventSchema),
  })

  const isApproved = watch('isApproved', eventData.isApproved)

  const handleEventSubmit = async (data) => {
    try {
      setIsLoading(true)
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
        case edit:
          res = await put(`facilities/event/timeslot/${slot._id}`, data)
          break
        default:
          await post(`facilities/event/timeslot/${slot._id}`, data)
          break
      }

      if (res.status === 201) {
        setIsLoading(false)
        onClose()
        return addToast('success', 'Event created!', 'success')
      }
      if (res.status === 200) {
        setIsLoading(false)
        onClose()
        return addToast('success', 'Event Updated!', 'success')
      }
      setIsLoading(false)
      onClose()
      return addToast('Error', 'Failed to create event', 'error')
    } catch (error) {
      console.log(error)
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

  useEffect(() => {
    if (isVisible) {
      setEventFormState(state)
      if (state === 'view' || state === 'edit') {
        getEventData()
      }
    }
  }, [isVisible, state])

  useEffect(() => {
    setIsReadOnly(eventFormState !== 'edit')
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
              <CModalTitle>{eventFormState === 'edit' ? 'Manage Event' : 'View Event'}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CContainer>
                <CRow className="mb-3">
                  <CCol>
                    <strong>
                      {formatTime(slot.start)} - {formatTime(slot.end)}
                    </strong>
                    <br />
                    <small className="text-muted"> Timeslot ID: {slot._id}</small>
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
                                {...register('isApproved')}
                                disabled={isReadOnly}
                              />
                            </CCol>
                          </CRow>
                          <CRow className="mb-3">
                            <CCol>
                              {(eventFormState === 'edit' || eventFormState === 'create') && (
                                <div className="d-flex justify-content-end gap-2">
                                  <CButton type="button" color="warning" onClick={handleMockData}>
                                    Fill Mock Data
                                  </CButton>
                                  <CButton type="submit" color="danger">
                                    Delete
                                  </CButton>
                                  <CButton type="submit" color="primary">
                                    {isLoading ? <CSpinner /> : 'Submit'}
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
                              <CCardHeader>Participants</CCardHeader>
                              <CCardBody>
                                <CTable align="middle" hover responsive striped>
                                  <CTableHead>
                                    <CTableRow>
                                      {/* <CTableHeaderCell>#</CTableHeaderCell> */}
                                      <CTableHeaderCell>Name</CTableHeaderCell>
                                      <CTableHeaderCell>Email</CTableHeaderCell>
                                      <CTableHeaderCell>Action</CTableHeaderCell>
                                    </CTableRow>
                                  </CTableHead>
                                  <CTableBody>
                                    {eventData.participants.map((participant) => {
                                      return (
                                        <CTableRow key={participant._id}>
                                          {/* <CTableDataCell>{participant._id}</CTableDataCell> */}
                                          <CTableDataCell>
                                            {participant.lastname}, {participant.firstname}
                                          </CTableDataCell>
                                          <CTableDataCell>{participant.email}</CTableDataCell>
                                          <CTableDataCell>
                                            {eventFormState === 'edit' ||
                                            eventFormState === 'create' ? (
                                              <CButton size="sm" color="danger">
                                                Remove
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
