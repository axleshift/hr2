import {
  CContainer,
  CRow,
  CCol,
  CCard,
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
import { post, put } from '../../../api/axios'
import { config } from '../../../config'

const FacilityForm = ({ isVisible, onClose, isEdit, facilityData }) => {
  const { addToast } = useContext(AppContext)

  const formSchema = z.object({
    name: z.string().nonempty('Name is required'),
    description: z.string().nonempty('Description is required'),
    location: z.string().nonempty('Location is required'),
  })

  const {
    register,
    handleSubmit,
    reset: formReset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  })

  const handleFormSubmit = async (data) => {
    console.log('Form data:', data)
    try {
      const res = isEdit
        ? await put(`/facilities/update/${facilityData._id}`, data)
        : await post('/facilities/create', data)
      if (res.status === 200 || res.status === 201) {
        addToast('Success', 'Facility Added Successfully', 'success')
      }

      formReset()
      onClose()
    } catch (error) {
      console.error(error)
      addToast('Error', 'An Error Occurred', 'danger')
    }
  }

  const handleMockData = () => {
    formReset({
      name: 'Facility Name',
      description: 'Facility Description',
      location: 'Facility Location',
    })
  }

  useEffect(() => {
    if (!isVisible) {
      formReset()
    }

    if (isEdit) {
      formReset({
        name: facilityData?.name,
        description: facilityData?.description,
        location: facilityData?.location,
      })
    }
  }, [isVisible, isEdit])

  return (
    <CModal
      visible={isVisible}
      onClose={() => {
        formReset()
        onClose()
      }}
    >
      <CModalHeader>
        {isEdit ? (
          <CModalTitle>Edit Facility</CModalTitle>
        ) : (
          <CModalTitle>Add Facility</CModalTitle>
        )}
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit(handleFormSubmit)}>
          <CRow className="mb-3">
            <CCol>
              <CFormInput
                type="text"
                label="Facility Name"
                placeholder="Facility Name"
                {...register('name')}
                defaultValue={facilityData?.name}
                invalid={!!errors?.name}
              />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CFormTextarea
                type="text"
                rows={5}
                label="Description"
                placeholder="Description"
                {...register('description')}
                defaultValue={facilityData?.description}
                invalid={!!errors?.description}
              />
              {errors.description && (
                <div className="invalid-feedback">{errors.description.message}</div>
              )}
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CFormInput
                type="text"
                label="Location"
                placeholder="Location"
                {...register('location')}
                defaultValue={facilityData?.location}
                invalid={!!errors?.location}
              />
              {errors.location && <div className="invalid-feedback">{errors.location.message}</div>}
            </CCol>
          </CRow>
          <CModalFooter>
            {config.env === 'development' && (
              <CButton color="warning" onClick={handleMockData}>
                Mock Data
              </CButton>
            )}
            <CButton color="primary" type="submit">
              {isEdit ? 'Update' : 'Create'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModalBody>
    </CModal>
  )
}

FacilityForm.propTypes = {
  isVisible: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
  isEdit: propTypes.bool.isRequired,
  facilityData: propTypes.object,
}

export default FacilityForm
