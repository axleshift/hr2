import React, { useEffect, useContext, useState } from 'react'
import propTypes from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
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
  CFormLabel,
} from '@coreui/react'
import { get, post, put } from '../../../api/axios'
import { AppContext } from '../../../context/appContext'
import { AuthContext } from '../../../context/authContext'
import { config } from '../../../config'

import JobOfferForm from './JobOfferForm'

const interviewSchema = z.object({
  date: z.string().nonempty('Date is required'),
  job: z.string().min(3, { message: 'Job is required' }),
  type: z.enum(['Phone', 'Video', 'In-Person']),
  general: z.object({
    communication: z.number().min(1).max(5).default(1),
    technical: z.number().min(1).max(5).default(1),
    problemSolving: z.number().min(1).max(5).default(1),
    culturalFit: z.number().min(1).max(5).default(1),
    workExperienceRelevance: z.number().min(1).max(5).default(1),
    leadership: z.number().min(1).max(5).default(1),
  }),
  questions: z
    .array(
      z.object({
        question: z.string().min(1, { message: 'A question is required.' }),
        remark: z.string().optional(),
      }),
    )
    .optional(),
  salaryExpectation: z.coerce.number().min(1).default(1),
  strength: z.string().optional(),
  weakness: z.string().optional(),
  recommendation: z.enum(['yes', 'no', 'need further review']),
  finalComments: z.string().optional(),
})

const InterviewForm = ({ isVisible, onClose, state, interview }) => {
  const [formVisible, setFormVisible] = useState(false)
  const [interviewData, setInterviewData] = useState({})
  const [formState, setFormState] = useState('view')
  const [isReadonly, setIsReadOnly] = useState(false)

  // job offer form state
  const [jobofferFormState, setJobofferFormState] = useState('create')
  const [jobofferFormIsVisible, setJobofferFormIsVisible] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
    control,
  } = useForm({
    resolver: async (data, context, options) => {
      const result = await zodResolver(interviewSchema)(data, context, options)
      console.log('Validation result:', result)
      return result
    },
  })

  const getInteview = async () => {
    try {
      const res = await get(`/applicant/interview/${interviewData._id}`)
      console.log('Interview Result', JSON.stringify(res.data, null, 2))
    } catch (error) {
      console.error(error)
    }
  }

  const onSubmit = async (data) => {
    try {
      console.log(data)
      if (formState === 'edit') {
        await put(`/applicant/interview/${interviewData._id}`, data)
      } else {
        await post('/applicant/interview', data)
      }
      onClose() // Close form after submission
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (state !== 'edit') {
      setIsReadOnly(true)
    } else {
      setIsReadOnly(false)
    }
  }, [state])

  useEffect(() => {
    if (formVisible && interview) {
      let formattedDate = ''
      if (interview.date) {
        const dateObj = new Date(interview.date)
        formattedDate = dateObj.toISOString().split('T')[0]
      }

      const formattedInterview = {
        ...interview,
        date: formattedDate,
      }

      setInterviewData(interview)
      console.log('Formatted Interview Data:', formattedInterview)
      reset(formattedInterview)
    }
  }, [formVisible, interview, reset])

  useEffect(() => {
    if (isVisible) {
      setFormVisible(isVisible)
    }
  }, [isVisible])

  return (
    <CModal
      visible={formVisible}
      onClose={() => {
        onClose()
        setFormVisible(false)
      }}
      backdrop="static"
      size="xl"
    >
      <CModalHeader>
        <CModalTitle>{formState === 'edit' ? 'Edit Interview' : 'Interview Form'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol>
            <CForm onSubmit={handleSubmit(onSubmit)}>
              <CRow className="mb-3">
                <CCol>
                  <CFormLabel>Date</CFormLabel>
                  <CFormInput
                    type="date"
                    {...register('date')}
                    readOnly={isReadonly}
                    invalid={errors.date}
                  />
                  {errors.date && <CFormFeedback>{errors.date.message}</CFormFeedback>}
                </CCol>

                <CCol>
                  <CFormLabel>Interview Type</CFormLabel>
                  <CFormSelect disabled={isReadonly} {...register('type')} invalid={errors.type}>
                    <option value="">Select Type</option>
                    <option value="Phone">Phone</option>
                    <option value="Video">Video</option>
                    <option value="In-Person">In-Person</option>
                  </CFormSelect>
                  {errors.type && <CFormFeedback>{errors.type.message}</CFormFeedback>}
                </CCol>
                <CCol>
                  <CFormLabel>Interviewer</CFormLabel>
                  <CFormInput
                    readOnly={isReadonly}
                    defaultValue={`${interview.interviewer?.lastname}, ${interview.interviewer?.firstname}`}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol xs="12">
                  <h5>General Evaluation</h5>
                  {[
                    'communication',
                    'technical',
                    'problemSolving',
                    'culturalFit',
                    'workExperienceRelevance',
                    'leadership',
                  ].map((field) => (
                    <div key={field}>
                      <label className="text-capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                      <CFormRange
                        min={1}
                        max={5}
                        disabled={isReadonly}
                        {...register(`general.${field}`)}
                        invalid={errors?.general?.[field]}
                      />
                      {errors?.general?.[field] && (
                        <CFormFeedback>{errors?.general?.[field]?.message}</CFormFeedback>
                      )}
                    </div>
                  ))}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <CFormInput
                    label="Position / Job Applied For"
                    readOnly={isReadonly}
                    {...register('job')}
                    invalid={errors.job}
                  />
                  {errors.job && <CFormFeedback>{errors.job.message}</CFormFeedback>}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol xs="12">
                  <h5>Interview Questions</h5>
                  {watch('questions')?.map((_, index) => (
                    <div key={index}>
                      <CRow className="mb-3">
                        <CCol>
                          <CFormLabel>Question</CFormLabel>
                          <CFormInput
                            readOnly={isReadonly}
                            {...register(`questions.${index}.question`)}
                            invalid={errors?.questions?.[index]?.question}
                          />
                          {errors?.questions?.[index]?.question && (
                            <CFormFeedback>
                              {errors?.questions?.[index]?.question?.message}
                            </CFormFeedback>
                          )}
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol>
                          <CFormLabel>Remark</CFormLabel>
                          <CFormTextarea
                            readOnly={isReadonly}
                            {...register(`questions.${index}.remark`)}
                          />
                        </CCol>
                      </CRow>
                    </div>
                  ))}
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol xs="12" sm="6">
                  <CFormLabel>Salary Expectation</CFormLabel>
                  <CFormInput
                    type="number"
                    readOnly={isReadonly}
                    {...register('salaryExpectation')}
                    invalid={errors.salaryExpectation}
                  />
                  {errors.salaryExpectation && (
                    <CFormFeedback>{errors.salaryExpectation.message}</CFormFeedback>
                  )}
                </CCol>
                <CCol xs="12" sm="6">
                  <CFormLabel>Recommendation</CFormLabel>
                  <CFormSelect
                    disabled={isReadonly}
                    {...register('recommendation')}
                    invalid={errors.recommendation}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="need further review">Need further review</option>
                  </CFormSelect>
                  {errors.recommendation && (
                    <CFormFeedback>{errors.recommendation.message}</CFormFeedback>
                  )}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <CFormLabel>Strength</CFormLabel>
                  <CFormTextarea readOnly={isReadonly} {...register('strength')} />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <CFormLabel>Weakness</CFormLabel>
                  <CFormTextarea readOnly={isReadonly} {...register('weakness')} />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol xs="12">
                  <CFormLabel>Final Comments</CFormLabel>
                  <CFormTextarea readOnly={isReadonly} {...register('finalComments')} />
                </CCol>
              </CRow>
            </CForm>
          </CCol>
        </CRow>
        <CRow>
          <CCol className="d-flex justify-content-end">
            <CButton
              color="warning"
              size="sm"
              onClick={() => {
                setJobofferFormState('create')
                setJobofferFormIsVisible(true)
              }}
            >
              Issue a Job Offer
            </CButton>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <JobOfferForm
              isVisible={jobofferFormIsVisible}
              state={jobofferFormState}
              onClose={() => {
                setJobofferFormIsVisible(false)
              }}
              interview={interviewData}
            />
          </CCol>
        </CRow>
      </CModalBody>
    </CModal>
  )
}

InterviewForm.propTypes = {
  isVisible: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
  state: propTypes.string,
  interview: propTypes.object.isRequired,
}

export default InterviewForm
