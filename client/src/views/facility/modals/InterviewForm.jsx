import React, { useEffect, useContext } from 'react'
import propTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CButton,
  CFormRange,
  CFormFeedback,
} from '@coreui/react'
import { post, put } from '../../../api/axios'
import { AppContext } from '../../../context/appContext'
import { AuthContext } from '../../../context/authContext'

const interviewSchema = z.object({
  applicant: z.string().nonempty('Applicant is required'),
  date: z.string().nonempty('Date is required'),
  type: z.enum(['Phone', 'Video', 'In-Person']),
  general: z.object({
    communication: z.number().min(1, 'Must be at least 1').max(5, 'Cannot exceed 5').default(1),
    technical: z.number().min(1, 'Must be at least 1').max(5, 'Cannot exceed 5').default(1),
    problemSolving: z.number().min(1, 'Must be at least 1').max(5, 'Cannot exceed 5').default(1),
    culturalFit: z.number().min(1, 'Must be at least 1').max(5, 'Cannot exceed 5').default(1),
    workExperienceRelevance: z
      .number()
      .min(1, 'Must be at least 1')
      .max(5, 'Cannot exceed 5')
      .default(1),
    leadership: z.number().min(1, 'Must be at least 1').max(5, 'Cannot exceed 5').default(1),
  }),
  strength: z.string().optional(),
  weakness: z.string().optional(),
  recommendation: z.enum(['yes', 'no', 'need further review']),
  finalComments: z.string().optional(),
})

const InterviewForm = ({ isVisible, onClose, isEdit, eventData, applicantData }) => {
  const { addToast } = useContext(AppContext)
  const { userInformation } = useContext(AuthContext)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(interviewSchema),
  })

  const onSubmit = async (data) => {
    try {
      const res = isEdit
        ? await put(`/interviews/update/${eventData._id}`, data)
        : await post('/interviews/create', data)

      if (res.status === 200 || res.status === 201) {
        addToast('Success', 'Interview saved successfully', 'success')
        reset()
        onClose()
      }
    } catch (error) {
      addToast('Error', 'An error occurred', 'danger')
    }
  }

  const handleFormReset = () => {
    reset({
      applicant: '',
      date: '',
      type: 'Phone',
      general: {
        communication: 1,
        technical: 1,
        problemSolving: 1,
        culturalFit: 1,
        workExperienceRelevance: 1,
        leadership: 1,
      },
      strength: '',
      weakness: '',
      recommendation: 'yes',
      finalComments: '',
    })
  }

  useEffect(() => {
    if (isVisible && eventData) {
      setTimeout(() => {
        reset({
          date: eventData?.date ? eventData.date.split('T')[0] : '',
          general: {
            communication: 1,
            technical: 1,
            problemSolving: 1,
            culturalFit: 1,
            workExperienceRelevance: 1,
            leadership: 1,
          },
        })
      }, 100)
    }
  }, [isVisible, eventData, reset])

  return (
    <CModal
      visible={isVisible}
      onClose={() => {
        onClose()
        handleFormReset()
      }}
      size="xl"
    >
      <CModalHeader>
        <CModalTitle>{isEdit ? 'Edit Interview' : 'Add Interview'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          {applicantData && (
            <CRow className="mb-3">
              <CCol>
                <CFormInput label="Firstname" value={applicantData.firstname} readOnly />
              </CCol>
              <CCol>
                <CFormInput label="Lastname" value={applicantData.lastname} readOnly />
              </CCol>
            </CRow>
          )}
          <CRow className="mb-3">
            <CCol>
              <CFormInput
                type="date"
                label="Date"
                {...register('date')}
                invalid={!!errors.date}
                readOnly
              />
              {errors.date && <CFormFeedback invalid>{errors.date.message}</CFormFeedback>}
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CFormSelect label="Type" {...register('type')} invalid={!!errors.type}>
                <option value="Phone">Phone</option>
                <option value="Video">Video</option>
                <option value="In-Person">In-Person</option>
              </CFormSelect>
              {errors.type && <CFormFeedback invalid>{errors.type.message}</CFormFeedback>}
            </CCol>
          </CRow>
          <h5>General Ratings</h5>
          {[
            'communication',
            'technical',
            'problemSolving',
            'culturalFit',
            'workExperienceRelevance',
            'leadership',
          ].map((field) => (
            <CRow className="mb-3" key={field}>
              <CCol>
                <label>
                  {field.replace(/([A-Z])/g, ' $1').trim()} ({watch(`general.${field}`)})
                </label>
                <CFormRange
                  min={1}
                  max={5}
                  step={1}
                  default={1}
                  {...register(`general.${field}`)}
                  invalid={!!errors.general?.[field]}
                />
                {errors.general?.[field] && (
                  <CFormFeedback invalid>{errors.general[field].message}</CFormFeedback>
                )}
              </CCol>
            </CRow>
          ))}
          <CRow className="mb-3">
            <CCol>
              <CFormSelect
                label="Recommendation"
                {...register('recommendation')}
                invalid={!!errors.recommendation}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="need further review">Need Further Review</option>
              </CFormSelect>
              {errors.recommendation && (
                <CFormFeedback invalid>{errors.recommendation.message}</CFormFeedback>
              )}
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CFormTextarea label="Strength" {...register('strength')} />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CFormTextarea label="Weakness" {...register('weakness')} />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CFormTextarea label="Final Comments" {...register('finalComments')} />
            </CCol>
          </CRow>
          <CModalFooter>
            {['admin', 'interviewer', 'manager'].includes(userInformation.role) ? (
              <CButton type="submit" color="primary" size="sm">
                {isEdit ? 'Update' : 'Create'}
              </CButton>
            ) : (
              <CButton color="danger" size="sm" disabled>
                No Permission
              </CButton>
            )}
          </CModalFooter>
        </CForm>
      </CModalBody>
    </CModal>
  )
}

InterviewForm.propTypes = {
  isVisible: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
  isEdit: propTypes.bool.isRequired,
  eventData: propTypes.object,
  applicantData: propTypes.object,
}

export default InterviewForm
