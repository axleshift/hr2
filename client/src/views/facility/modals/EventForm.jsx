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

const EventForm = ({ isVisible, onClose, isEdit, slot }) => {
  const { addToast } = useContext(AppContext)
  const [eventData, setEvenData] = React.useState({})
  const [isEventLoading, setIsEventLoading] = React.useState(false)

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
  })

  const {
    register,
    handleSubmit,
    reset: formReset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(EventSchema),
  })

  const handleEventSubmit = async (data) => {
    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('capacity', data.capacity)
      const res = isEdit
        ? await put(`facilities/event/timeslot/${slot._id}`, data)
        : await post(`facilities/event/timeslot/${slot._id}`, data)
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
    if (isEdit) {
      getEventData()
    }
  }, [isEdit])

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
            }}
            size="xl"
          >
            <CModalHeader>
              <CModalTitle>{isEdit ? 'Manage Event' : 'Add Event'}</CModalTitle>
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
                {isEventLoading && isEdit ? (
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
                                            <CButton size="sm" color="danger">
                                              Remove
                                            </CButton>
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
  isEdit: propTypes.bool,
  slot: propTypes.object,
}

export default EventForm
