import React from 'react'
import propTypes from 'prop-types'
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
  CFormFeedback,
  CRow,
  CCol,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const TimeModal = ({ isVisible, onClose, handleTimeSubmit }) => {
  const timeSchema = z.object({
    start: z.string().min(1, { message: 'Start time is required' }),
    end: z.string().min(1, { message: 'End time is required' }),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(timeSchema),
  })

  return (
    <CModal visible={isVisible} onClose={onClose} size="sm">
      <CModalHeader>
        <CModalTitle>Add Time Range</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit(handleTimeSubmit)}>
          <CRow>
            <CCol>
              <CInputGroup className="mb-3">
                <CInputGroupText>Start Time</CInputGroupText>
                <CFormInput type="time" {...register('start')} invalid={!!errors.start} />
                {errors.start && <CFormFeedback invalid>{errors.start.message}</CFormFeedback>}
              </CInputGroup>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CInputGroup className="mb-3">
                <CInputGroupText>End Time</CInputGroupText>
                <CFormInput type="time" {...register('end')} invalid={!!errors.end} />
                {errors.end && <CFormFeedback invalid>{errors.end.message}</CFormFeedback>}
              </CInputGroup>
            </CCol>
          </CRow>
          <CModalFooter>
            <CButton type="submit" className="btn btn-primary">
              Add
            </CButton>
            <CButton color="secondary" onClick={onClose}>
              Cancel
            </CButton>
          </CModalFooter>
        </CForm>
      </CModalBody>
    </CModal>
  )
}

TimeModal.propTypes = {
  isVisible: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
  handleTimeSubmit: propTypes.func.isRequired,
}

export default TimeModal
