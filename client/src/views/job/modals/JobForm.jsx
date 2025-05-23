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

import React, { useContext, useEffect, useState } from 'react'
import propTypes from 'prop-types'
import { AppContext } from '../../../context/appContext'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { del, get, post, put } from '../../../api/axios'
import { config } from '../../../config'
import { formatTime } from '../../../utils'
import { AuthContext } from '../../../context/authContext'

const categoryTypes = ['internship', 'full-time', 'part-time', 'contract', 'temporary', 'freelance']

const JobSchema = z.object({
  title: z.string().min(3).max(50),
  responsibilities: z.string().min(3).max(250),
  requirements: z.string().min(3).max(250),
  qualifications: z.string().min(3).max(250),
  benefits: z.string().min(3).max(250),
  category: z.enum(categoryTypes),
  capacity: z.number().min(1).default(1),
})

const JobForm = ({ isVisible, onClose, state, job }) => {
  const { addToast } = useContext(AppContext)
  const { userInformation } = useContext(AuthContext)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    watch,
    handleSubmit,
    reset: formReset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: async (data, context, options) => {
      const result = await zodResolver(JobSchema)(data, context, options)
      console.log('Validation result:', result)
      return result
    },
  })

  const getJob = async () => {
    try {
      setIsLoading(true)
      const res = await get(`/job/${job._id}`)
      console.log(res.data.data)
      if (res.status === 200) {
        setIsLoading(false)
        formReset(res.data.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleJobSubmit = async (data) => {
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('responsibilities', data.responsibilities)
      formData.append('requirements', data.requirements)
      formData.append('qualifications', data.qualifications)
      formData.append('benefits', data.benefits)
      formData.append('category', data.category)
      formData.append('capacity', data.capacity)

      let res
      switch (state) {
        case 'create':
          res = await post(`/job/`, formData)
          break
        case 'edit':
          res = await put(`/job/${job._id}`, formData)
          break
        default:
          throw new Error('Invalid form state')
      }

      if (res.status === 200 || res.status === 201) {
        addToast('Success', res.data.message, 'success')
        if (state === 'create') onClose()
      }
    } catch (error) {
      console.error(error)
      addToast('Error', error?.response?.data?.message || 'Something went wrong', 'danger')
    }
  }

  const handleMockFill = () => {
    formReset({
      title: 'Software Engineer',
      responsibilities: 'Develop and maintain web applications.',
      requirements: 'Experience with JavaScript, React, and Node.js.',
      qualifications: 'Bachelor’s degree in Computer Science or equivalent experience.',
      benefits: 'Flexible work hours, health insurance, remote work options.',
      category: 'full-time',
      capacity: 3,
    })
  }

  const handleFormReset = async () => {
    formReset({
      title: '',
      responsibilities: '',
      requirements: '',
      qualifications: '',
      benefits: '',
      category: 'temporary',
      capacity: 1,
    })
  }

  useEffect(() => {
    if (isVisible && job && state === 'edit') {
      getJob()
    } else {
      setIsLoading(false)
    }
  }, [job, isVisible, state])

  useEffect(() => {
    if (state === 'edit' || state === 'create') {
      setIsReadOnly(false)
    } else {
      setIsReadOnly(true)
    }
  }, [state])

  return (
    <CModal
      visible={isVisible}
      onClose={() => {
        onClose()
        handleFormReset()
      }}
      size="lg"
    >
      <CModalHeader>
        <CModalTitle>{state === 'create' ? 'Create job' : 'Manage Job'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CContainer>
          {config.env === 'development' && (
            <CRow className="mb-3">
              <CCol className="d-flex justify-content-end">
                <CButton type="button" color="secondary" size="sm" onClick={handleMockFill}>
                  Fill Mock Data
                </CButton>
              </CCol>
            </CRow>
          )}
          <CRow>
            <CCol>
              {isLoading ? (
                <>
                  <CSpinner size="sm" />
                  <span>Loading...</span>
                </>
              ) : (
                <CForm onSubmit={handleSubmit(handleJobSubmit)}>
                  <CRow className="mb-3">
                    <CCol>
                      <CFormInput
                        type="text"
                        label="Title"
                        placeholder=""
                        readOnly={isReadOnly}
                        {...register('title')}
                        invalid={errors.title}
                      />
                      {errors.title && (
                        <CFormFeedback invalid className="text-danger">
                          {errors.title.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol>
                      <CFormTextarea
                        type="text"
                        label="Responsibilities"
                        placeholder=""
                        readOnly={isReadOnly}
                        {...register('responsibilities')}
                        invalid={errors.responsibilities}
                      />
                      {errors.responsibilities && (
                        <CFormFeedback invalid className="text-danger">
                          {errors.responsibilities.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol>
                      <CFormTextarea
                        type="text"
                        label="Requirements"
                        placeholder=""
                        readOnly={isReadOnly}
                        {...register('requirements')}
                        invalid={errors.requirements}
                      />
                      {errors.requirements && (
                        <CFormFeedback invalid className="text-danger">
                          {errors.requirements.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol>
                      <CFormTextarea
                        type="text"
                        label="Qualifications"
                        placeholder=""
                        readOnly={isReadOnly}
                        {...register('qualifications')}
                        invalid={errors.qualifications}
                      />
                      {errors.qualifications && (
                        <CFormFeedback invalid className="text-danger">
                          {errors.qualifications.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol>
                      <CFormTextarea
                        type="text"
                        label="Benefits"
                        placeholder=""
                        readOnly={isReadOnly}
                        {...register('benefits')}
                        invalid={errors.benefits}
                      />
                      {errors.benefits && (
                        <CFormFeedback invalid className="text-danger">
                          {errors.benefits.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol>
                      <CFormLabel htmlFor="category">Category</CFormLabel>
                      <CFormSelect
                        id="category"
                        readOnly={isReadOnly}
                        {...register('category', { required: 'Please select a category' })}
                        invalid={!!errors.category}
                      >
                        <option value="">Select a category</option>
                        {categoryTypes.map((category) => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </CFormSelect>
                      {errors.category && (
                        <CFormFeedback invalid className="text-danger">
                          {errors.category.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol>
                      <CFormInput
                        type="number"
                        label="Capacity"
                        defaultValue={1}
                        placeholder=""
                        readOnly={isReadOnly}
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
                  {state !== 'view' && (
                    <CRow className="mb-3">
                      <CCol className="d-flex justify-content-end">
                        <CButton type="submit" color="primary" size="sm">
                          {state === 'edit' ? 'Update' : 'Create'}
                        </CButton>
                      </CCol>
                    </CRow>
                  )}

                  {['admin', 'manager', 'recruiter'].includes(userInformation.role) && (
                    <CRow>
                      <CCol className="d-flex justify-content-end">
                        <CButton color="info" size="sm">
                          Create Jobposting from this job?
                        </CButton>
                      </CCol>
                    </CRow>
                  )}
                </CForm>
              )}
            </CCol>
          </CRow>
        </CContainer>
      </CModalBody>
    </CModal>
  )
}

JobForm.propTypes = {
  isVisible: propTypes.bool,
  onClose: propTypes.func,
  state: propTypes.string,
  job: propTypes.object,
}

export default JobForm
