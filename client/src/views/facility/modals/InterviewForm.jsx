import React, { useEffect, useContext, useState } from 'react'
import propTypes from 'prop-types'
import { useFieldArray, useForm } from 'react-hook-form'
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
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
  CContainer,
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CSpinner,
} from '@coreui/react'
import { get, post, put } from '../../../api/axios'
import { AppContext } from '../../../context/appContext'
import { AuthContext } from '../../../context/authContext'
import { config } from '../../../config'
import AppPagination from '../../../components/AppPagination'
import { formatDate } from '../../../utils'

const interviewSchema = z.object({
  date: z.string().nonempty('Date is required'),
  job: z.string().min(1, { message: 'Job is required' }),
  type: z.enum(['Phone', 'Video', 'In-Person']),
  interviewType: z.string().optional(),
  general: z.object({
    communication: z.coerce.number().min(1).max(5).default(1),
    technical: z.coerce.number().min(1).max(5).default(1),
    problemSolving: z.coerce.number().min(1).max(5).default(1), // Fixed typo
    culturalFit: z.coerce.number().min(1).max(5).default(1),
    workExperienceRelevance: z.coerce.number().min(1).max(5).default(1),
    leadership: z.coerce.number().min(1).max(5).default(1),
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

const InterviewForm = ({ isVisible, onClose, state, eventData, applicantData }) => {
  const { addToast } = useContext(AppContext)
  const { userInformation } = useContext(AuthContext)

  const [interviews, setInterviews] = useState([])
  const [interview, setInterview] = useState([])
  const [isInterviewsLoading, setIsInterviewsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [formState, setFormState] = useState('view')

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: async (data, context, options) => {
      const result = await zodResolver(interviewSchema)(data, context, options)
      console.log('Validation result:', result)
      return result
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  })

  const getAllInterviews = async () => {
    try {
      setIsInterviewsLoading(true)
      const res = searchQuery
        ? await get(
            `/applicant/interview/all/${applicantData._id}?query=${searchQuery}&page=${currentPage}&limit=${itemsPerPage}&sort=desc`,
          )
        : await get(
            `/applicant/interview/all/${applicantData._id}?page=${currentPage}&limit=${itemsPerPage}&sort=desc`,
          )
      console.log('Interviews', JSON.stringify(res.data.data, null, 2))
      switch (res.status) {
        case 200:
          setInterviews(res.data.data)
          setTotalItems(res.data.totalItems)
          setTotalPages(res.data.totalPages)
          setCurrentPage(res.data.currentPage)
          break

        default:
          setInterviews([])
          setTotalItems(0)
          setTotalPages(0)
          setCurrentPage(1)
          break
      }
      setIsInterviewsLoading(false)
    } catch (error) {
      console.error(error)
      setIsInterviewsLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      const formData = {
        date: data.date,
        job: data.job,
        type: data.type,
        interviewType: eventData.type,
        general: {
          communication: data.general.communication,
          technical: data.general.technical,
          problemSolving: data.general.problemSolving,
          culturalFit: data.general.culturalFit,
          workExperienceRelevance: data.general.workExperienceRelevance,
          leadership: data.general.leadership,
        },
        questions: data.questions || [],
        salaryExpectation: data.salaryExpectation,
        strength: data.strength,
        weakness: data.weakness,
        recommendation: data.recommendation,
        finalComments: data.finalComments,
      }
      const res =
        formState === 'edit'
          ? await put(`/applicant/interview/${interview._id}`, formData)
          : await post(`/applicant/interview/${applicantData._id}/${eventData._id}`, formData)

      if (res.status === 200 || res.status === 201) {
        addToast('Success', 'Interview saved successfully', 'success')
        reset()
        onClose()
      }
    } catch (error) {
      addToast('Error', 'An error occurred', 'danger')
    }
  }

  const handleView = (item) => {
    setFormState('edit')
    reset({
      date: item.date ? item.date.split('T')[0] : '',
      job: item.job ? item.job : '',
      type: item.type || 'Phone',
      interviewType: eventData?.type,
      general: {
        communication: item.general?.communication || 1,
        technical: item.general?.technical || 1,
        problemSolving: item.general?.problemSolving || 1,
        culturalFit: item.general?.culturalFit || 1,
        workExperienceRelevance: item.general?.workExperienceRelevance || 1,
        leadership: item.general?.leadership || 1,
      },
      questions: item.questions?.length ? item.questions : [{ question: '', remark: '' }],
      salaryExpectation: item.salaryExpectation || 1,
      strength: item.strength || '',
      weakness: item.weakness || '',
      recommendation: item.recommendation || 'yes',
      finalComments: item.finalComments || '',
    })
    addToast('Success', 'Interview fetched. Please change to forms tab.', 'success')
  }

  const handleFormReset = () => {
    reset({
      applicant: '',
      job: '',
      date: '',
      type: 'Phone',
      interviewType: 'initialInterview',
      general: {
        communication: 1,
        technical: 1,
        problemSolving: 1,
        culturalFit: 1,
        workExperienceRelevance: 1,
        leadership: 1,
      },
      salaryExpectation: 1,
      strength: '',
      weakness: '',
      recommendation: 'yes',
      finalComments: '',
    })
  }

  useEffect(() => {
    if (isVisible && eventData) {
      console.info('EVENTDATA', JSON.stringify(eventData, null, 2))
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

  useEffect(() => {
    if (isVisible) {
      setFormState(state)
      getAllInterviews()
    }
  }, [isVisible, state])

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
        {/* <CModalTitle>{isEdit ? 'Edit Interview' : 'Interview Form'}</CModalTitle> */}
        <CModalTitle>{formState === 'edit' ? 'Edit Interview' : 'Interview Form'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CTabs activeItemKey={'form'}>
          <CTabList variant="tabs">
            <CTab itemKey={'form'}>Form</CTab>
            <CTab itemKey={'history'}>History</CTab>
          </CTabList>
          <CTabContent>
            <CTabPanel itemKey={'form'}>
              <CForm onSubmit={handleSubmit(onSubmit)} className="mt-3">
                {config.env === 'development' && (
                  <CRow>
                    <CCol>
                      <p>Applicant Id: {applicantData._id}</p>
                      <p>Event Id: {eventData._id}</p>
                    </CCol>
                  </CRow>
                )}
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
                    <CFormSelect
                      label="Interview Type"
                      {...register('type')}
                      invalid={!!errors.type}
                    >
                      <option value="Phone">Phone</option>
                      <option value="Video">Video</option>
                      <option value="In-Person">In-Person</option>
                    </CFormSelect>
                    {errors.type && <CFormFeedback invalid>{errors.type.message}</CFormFeedback>}
                  </CCol>
                  <CCol>
                    <CFormInput label="Event Type" value={eventData.type} readOnly />
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
                        {...register(`general.${field}`, { valueAsNumber: true })}
                        invalid={!!errors.general?.[field]}
                      />
                      {errors.general?.[field] && (
                        <CFormFeedback invalid>{errors.general[field].message}</CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                ))}
                <CRow>
                  <CCol className="d-flex justify-content-end">
                    <CButton
                      type="button"
                      color="info"
                      size="sm"
                      onClick={() => append({ question: '', remark: '' })}
                    >
                      Add Question
                    </CButton>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    {fields.map((item, index) => (
                      <CRow key={item.id} className="mb-3">
                        <CCol>
                          <CRow className="mb-3">
                            <CCol>
                              <CFormInput
                                label={`Question ${index + 1}`}
                                autoComplete="question"
                                {...register(`questions.${index}.question`)}
                                invalid={!!errors.questions?.[index]?.question}
                              />
                              {errors.questions?.[index]?.question && (
                                <CFormFeedback invalid>
                                  {errors.questions[index].question.message}
                                </CFormFeedback>
                              )}
                            </CCol>
                          </CRow>
                          <CRow className="mb-2">
                            <CCol>
                              <CFormTextarea
                                label="Remarks"
                                autoComplete="remark"
                                {...register(`questions.${index}.remark`)}
                              />
                            </CCol>
                          </CRow>
                          <CRow className="mb-2">
                            <CCol>
                              <CCol>
                                <div className="d-flex justify-content-end">
                                  <CButton
                                    type="button"
                                    color="danger"
                                    size="sm"
                                    onClick={() => remove(index)}
                                  >
                                    Remove
                                  </CButton>
                                </div>
                              </CCol>
                            </CCol>
                          </CRow>
                        </CCol>
                      </CRow>
                    ))}
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <CFormInput
                      label="Job / Position Applied For"
                      {...register('job')}
                      invalid={!!errors.job}
                    ></CFormInput>
                    {errors.job && <CFormFeedback invalid>{errors.job.message}</CFormFeedback>}
                  </CCol>
                  <CCol>
                    <CFormInput
                      type="number"
                      label="Salary Expectations"
                      {...register('salaryExpectation', { valueAsNumber: true })}
                      invalid={!!errors.salaryExpectation}
                    ></CFormInput>
                    {errors.salaryExpectation && (
                      <CFormFeedback invalid>{errors.salaryExpectation.message}</CFormFeedback>
                    )}
                  </CCol>
                </CRow>
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
                <CRow>
                  <CCol className="d-flex justify-content-end">
                    {['admin', 'interviewer', 'manager'].includes(userInformation.role) ? (
                      <CButton type="submit" color="primary" size="sm">
                        {/* {isEdit ? 'Update' : 'Create'} */}
                        {formState === 'edit' ? 'Update' : 'Create'}
                      </CButton>
                    ) : (
                      <CButton color="danger" size="sm" disabled>
                        No Permission
                      </CButton>
                    )}
                  </CCol>
                </CRow>
              </CForm>
            </CTabPanel>
            <CTabPanel itemKey={'history'}>
              <CContainer className="mt-3">
                <CRow className="mb-3">
                  <CCol>
                    <CCard>
                      <CCardBody>
                        <CTable align="middle" hover responsive striped>
                          <CTableHead>
                            <CTableHeaderCell>Interviewer</CTableHeaderCell>
                            <CTableHeaderCell>Type</CTableHeaderCell>
                            <CTableHeaderCell>Event Type</CTableHeaderCell>
                            <CTableHeaderCell>Job</CTableHeaderCell>
                            <CTableHeaderCell>Recommendation</CTableHeaderCell>
                            <CTableHeaderCell>Created</CTableHeaderCell>
                            <CTableHeaderCell>Actions</CTableHeaderCell>
                          </CTableHead>
                          <CTableBody>
                            {isInterviewsLoading ? (
                              <CTableRow>
                                <CTableDataCell colSpan="12">
                                  <div className="pt-3 text-center">
                                    <CSpinner color="primary" variant="grow" />
                                  </div>
                                </CTableDataCell>
                              </CTableRow>
                            ) : interviews.length === 0 ? (
                              <CTableRow>
                                <CTableDataCell colSpan="12">
                                  <div className="text-center">No Interviews History Found</div>
                                </CTableDataCell>
                              </CTableRow>
                            ) : (
                              interviews.map((int) => {
                                return (
                                  <CTableRow key={int._id}>
                                    <CTableDataCell>
                                      <div>
                                        {int.interviewer.lastname}, {int.interviewer.firstname}
                                      </div>
                                    </CTableDataCell>
                                    <CTableDataCell>{int.type}</CTableDataCell>
                                    <CTableDataCell>{int?.event?.type}</CTableDataCell>
                                    <CTableDataCell>{int?.job}</CTableDataCell>
                                    <CTableDataCell className="text-capitalize">
                                      {int.recommendation}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                      {formatDate(int.date, 'MMM DD YYYY h:mm A')}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                      <CButton
                                        color="primary"
                                        size="sm"
                                        onClick={() => {
                                          handleView(int)
                                          setInterview(int)
                                        }}
                                      >
                                        View
                                      </CButton>
                                    </CTableDataCell>
                                  </CTableRow>
                                )
                              })
                            )}
                          </CTableBody>
                        </CTable>
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <div className="d-flex flex-row gap-2 justify-content-center align-items-center">
                      <AppPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  </CCol>
                </CRow>
              </CContainer>
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </CModalBody>
    </CModal>
  )
}

InterviewForm.propTypes = {
  isVisible: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
  state: propTypes.string,
  eventData: propTypes.object,
  applicantData: propTypes.object,
}

export default InterviewForm
