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
  CFormLabel,
} from '@coreui/react'

import React, { useContext, useEffect, useState } from 'react'
import propTypes from 'prop-types'
import { AppContext } from '../../../context/appContext'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { post, put } from '../../../api/axios'
import { config } from '../../../config'
import { AuthContext } from '../../../context/authContext'

const RequirementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
})

const formSchema = z.object({
  name: z.string().nonempty('Name is required'),
  type: z.string().nonempty('Type is required'),
  description: z.string().nonempty('Description is required'),
  requirements: z.array(RequirementSchema).optional(),
  location: z.string().nonempty('Location is required'),
})

const FacilityForm = ({ isVisible, onClose, isEdit, facilityData }) => {
  const { addToast } = useContext(AppContext)
  const { userInformation } = useContext(AuthContext)

  const [isSubmitLoading, setIsSubmitLoading] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset: formReset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: facilityData || { requirements: [] }, // Ensure default values are set on load
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'requirements',
  })

  const handleFormSubmit = async (data) => {
    console.log('Form data:', data)
    try {
      setIsSubmitLoading(true)

      const formData = {
        name: data.name,
        type: data.type,
        description: data.description,
        requirements: data.requirements || [],
        location: data.location,
      }

      const res = isEdit
        ? await put(`/facilities/update/${facilityData._id}`, formData)
        : await post('/facilities/create', formData)

      if (res.status === 200 || res.status === 201) {
        addToast('Success', 'Facility Added Successfully', 'success')
      }

      // Update form values with the response data
      setValue('name', res.data.data.name)
      setValue('type', res.data.data.type)
      setValue('description', res.data.data.description)
      setValue('requirements', res.data.data.requirements || [])
      setValue('location', res.data.data.location)

      setIsSubmitLoading(false)
      onClose()
    } catch (error) {
      console.error(error)
      addToast('Error', 'An Error Occurred', 'danger')
    }
  }

  const handleMockData = () => {
    formReset({
      name: 'Facility Name',
      type: 'Facility Type',
      description: 'Facility Description',
      location: 'Facility Location',
      requirements: [{ title: 'Requirement 1', description: 'Description 1' }],
    })
  }

  useEffect(() => {
    if (!isVisible) {
      formReset()
    }

    if (isEdit && facilityData) {
      formReset({
        name: facilityData?.name,
        type: facilityData?.type,
        description: facilityData?.description,
        location: facilityData?.location,
        requirements: facilityData?.requirements || [], // Default empty array if no requirements
      })
    }
  }, [isVisible, isEdit, facilityData, formReset])

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
                invalid={!!errors?.name}
              />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CFormInput
                type="text"
                label="Type"
                placeholder="Type"
                {...register('type')}
                invalid={!!errors?.type}
              />
              {errors.type && <div className="invalid-feedback">{errors.type.message}</div>}
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
                invalid={!!errors?.description}
              />
              {errors.description && (
                <div className="invalid-feedback">{errors.description.message}</div>
              )}
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CFormLabel>Requirements</CFormLabel>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol className="d-flex gap-2 flex-column">
              {fields.map((item, index) => (
                <div key={item.id} className="d-flex gap-3 flex-column">
                  <div>
                    <CFormLabel>Title</CFormLabel>
                    <CInputGroup>
                      <CFormInput
                        type="text"
                        placeholder="Title"
                        {...register(`requirements.${index}.title`)}
                      />
                      {['admin', 'manager', 'interviewer'].includes(userInformation.role) && (
                        <CButton color="danger" onClick={() => remove(index)}>
                          Remove
                        </CButton>
                      )}
                    </CInputGroup>
                  </div>
                  <div>
                    <CFormTextarea
                      type="text"
                      label="Description"
                      placeholder="Description"
                      {...register(`requirements.${index}.description`)}
                    />
                  </div>
                </div>
              ))}

              {['admin', 'manager', 'interviewer'].includes(userInformation.role) && (
                <CButton
                  color="success"
                  size="sm"
                  onClick={() => append({ title: '', description: '' })}
                >
                  Add Requirement
                </CButton>
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
            {isSubmitLoading ? (
              <CButton color="primary" type="submit" disabled={!isSubmitLoading}>
                <CSpinner size="sm" /> Loading...
              </CButton>
            ) : (
              <CButton color="primary" type="submit">
                {isEdit ? 'Update' : 'Create'}
              </CButton>
            )}
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
