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
  type: z.enum(['Phone', 'Video', 'In-Person']),
  general: z.object({
    communication: z.number().min(1).max(5).default(1),
    technical: z.number().min(1).max(5).default(1),
    problemSolving: z.number().min(1).max(5).default(1), // Fixed typo
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
  strength: z.string().optional(),
  weakness: z.string().optional(),
  recommendation: z.enum(['yes', 'no', 'need further review']),
  finalComments: z.string().optional(),
})

const InterviewForm = ({ isVisible, onClose, isEdit, eventData, applicantData }) => {
  const { addToast } = useContext(AppContext)
  const { userInformation } = useContext(AuthContext)

  const [interviews, setInterviews] = useState([])
  const [isInterviewsLoading, setIsInterviewsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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
    resolver: zodResolver(interviewSchema),
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

  const handleView = (item) => {
    reset({
      date: item.date ? item.date.split('T')[0] : '',
      type: item.type || 'Phone',
      general: {
        communication: item.general?.communication || 1,
        technical: item.general?.technical || 1,
        problemSolving: item.general?.problemSolving || 1,
        culturalFit: item.general?.culturalFit || 1,
        workExperienceRelevance: item.general?.workExperienceRelevance || 1,
        leadership: item.general?.leadership || 1,
      },
      questions: item.questions?.length ? item.questions : [{ question: '', remark: '' }],
      strength: item.strength || '',
      weakness: item.weakness || '',
      recommendation: item.recommendation || 'yes',
      finalComments: item.finalComments || '',
    })
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
      getAllInterviews()
    }
  }, [isVisible])

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
        <CModalTitle>{isEdit ? 'Edit Interview' : 'Interview Form'}</CModalTitle>
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
                        {...register(`general.${field}`)}
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
                        {isEdit ? 'Update' : 'Create'}
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
                                        onClick={() => handleView(int)}
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
  isEdit: propTypes.bool.isRequired,
  eventData: propTypes.object,
  applicantData: propTypes.object,
}

export default InterviewForm
