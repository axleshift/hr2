import React, { useEffect, useContext, useState } from 'react'
import propTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CContainer,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CButton,
  CFormRange,
  CFormFeedback,
  CSpinner,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CTableFoot,
  CCard,
  CCardBody,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
} from '@coreui/react'
import { get, post, put } from '../../../api/axios'
import { AppContext } from '../../../context/appContext'
import { AuthContext } from '../../../context/authContext'
import AppPagination from '../../../components/AppPagination'
import {
  faHamburger,
  faList,
  faMagicWandSparkles,
  faSprayCanSparkles,
  faTh,
} from '@fortawesome/free-solid-svg-icons'
import { config } from '../../../config'
import { formatDate, trimString } from '../../../utils'

const screeningSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'rejected', 'shortlisted']),
  recommendation: z.enum(['yes', 'no', 'needs further review']),
  aiAnalysis: z.object({
    summary: z.string().min(3).max(1250),
    scoreBreakdown: z.object({
      experience: z.coerce.number().min(1).max(5).default(1),
      education: z.coerce.number().min(1).max(5).default(1),
      skills: z.coerce.number().min(1).max(5).default(1),
      motivation: z.coerce.number().min(1).max(5).default(1),
    }),
    comments: z.string().optional(),
  }),
})

const promptSchema = z.object({
  prompt: z.string().optional(),
})

const ScreeningForm = ({ isVisible, onClose, state, applicant }) => {
  const { addToast } = useContext(AppContext)
  const { userInformation } = useContext(AuthContext)

  const [formState, setFormState] = useState('edit')

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isPromptFormVisible, setIsPromptFormVisible] = useState(false)
  const [gridState, setGridState] = useState(false)

  const [isSubmitLoading, setIsSubmitLoading] = useState(false)

  const [screenings, setScreenings] = useState([])
  const [isScreeningLoading, setIsScreeningLoading] = useState(false)
  const [screening, setScreening] = useState({})

  const [searchQuery, setSearchQuery] = useState('')

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: async (data, context, options) => {
      const result = await zodResolver(screeningSchema)(data, context, options)
      console.log('Validation result:', result)
      return result
    },
  })

  const {
    register: promptRegister,
    handleSubmit: promptSubmit,
    reset: promptReset,
    setValue: promptSetValue,
    watch: promptWatch,
    formState: { errors: promptErrors },
  } = useForm({
    resolver: async (data, context, options) => {
      const result = await zodResolver(promptSchema)(data, context, options)
      console.log('Validation result:', result)
      return result
    },
  })

  const onSubmit = async (data) => {
    try {
      setIsSubmitLoading(true)
      const formData = new FormData()
      formData.append('status', data.status)
      formData.append('recommendation', data.recommendation)
      formData.append('aiAnalysis', data.aiAnalysis)

      let res
      switch (formState) {
        case 'edit':
          res = await put(`/applicant/screen/${applicant._id}`, data)
          break

        default:
          res = await post(`/applicant/screen/${applicant._id}`, data)
          break
      }

      setIsSubmitLoading(false)
      console.log(JSON.stringify(res.data, null, 2))
    } catch (error) {
      addToast('Error', 'An error occurred', 'danger')
    }
  }

  const handleAnalyzeWithAI = async (data) => {
    try {
      setIsPromptFormVisible(false)
      console.log('applicant', applicant._id)
      setIsAnalyzing(true)

      if (data) {
        const formData = new FormData()
        formData.append('customPrompt', data.prompt)
      }

      const res = await get(`/applicant/screen/ai/${applicant._id}`, data)
      const response = res.data.data

      switch (res.status) {
        case 200:
          setIsAnalyzing(false)
          addToast('Success', res.data.message, 'success')

          reset({
            recommendation: response.recommendation,
            aiAnalysis: {
              summary: response.aiAnalysis.summary,
              scoreBreakdown: {
                experience: response.aiAnalysis.scoreBreakdown.experience,
                education: response.aiAnalysis.scoreBreakdown.education,
                skills: response.aiAnalysis.scoreBreakdown.skills,
                motivation: response.aiAnalysis.scoreBreakdown.motivation,
              },
              comments: response.aiAnalysis.comments,
            },
          })

          setIsPromptFormVisible(false)
          break

        default:
          setIsAnalyzing(false)
          addToast('Error', res.data.message, 'error')
          setIsPromptFormVisible(false)
          break
      }
    } catch (error) {
      setIsAnalyzing(false)
      setIsPromptFormVisible(false)
      console.error('Error during AI analysis:', error)
    }
  }

  const getApplicantScreenings = async () => {
    try {
      setIsScreeningLoading(true)

      const res = searchQuery
        ? await get(
            `/applicant/screen/all/${applicant._id}?query=${searchQuery}&page=${currentPage}&limit=${itemsPerPage}`,
          )
        : await get(
            `/applicant/screen/all/${applicant._id}?page=${currentPage}&limit=${itemsPerPage}`,
          )
      const sce = res.data
      setScreenings(sce.data)
      setTotalItems(sce.totalItems)
      setTotalPages(sce.totalPages)
      setCurrentPage(sce.currentPage)
      setIsScreeningLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSetScreening = async (screening) => {
    try {
      console.info('Screen', screening)
      setScreening(screening)
      reset({
        status: screening.status,
        recommendation: screening.recommendation,
        aiAnalysis: {
          summary: screening.aiAnalysis.summary,
          scoreBreakdown: {
            experience: screening.aiAnalysis.scoreBreakdown.experience,
            education: screening.aiAnalysis.scoreBreakdown.education,
            skills: screening.aiAnalysis.scoreBreakdown.skills,
            motivation: screening.aiAnalysis.scoreBreakdown.motivation,
          },
          comments: screening.aiAnalysis.comments,
        },
      })
      addToast('Success', 'Applicant screening fetched. Change to forms tab.', 'success')
    } catch (error) {
      console.error(error)
    }
  }

  const handleFormReset = () => {
    reset({
      status: '',
      recommendation: '',
      aiAnalysis: {
        summary: '',
        scoreBreakdown: {
          experience: 1,
          education: 1,
          skills: 1,
          motivation: 1,
        },
        comments: '',
      },
    })
  }

  useEffect(() => {
    if (isVisible) {
      setFormState(formState)
    }
  }, [isVisible, formState])

  useEffect(() => {
    if (isVisible) {
      getApplicantScreenings()
    }
  }, [isVisible, currentPage, totalPages, totalItems, searchQuery])

  return (
    <CModal
      visible={isVisible}
      onClose={() => {
        onClose()
        handleFormReset()
      }}
      size="xl"
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle>
          {formState === 'create' && formState === 'edit' ? 'Manage' : 'View'}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CTabs activeItemKey={'form'}>
          <CTabList variant="tabs">
            <CTab itemKey={'form'}>Form</CTab>
            <CTab itemKey={'history'}>History</CTab>
          </CTabList>
          <CTabContent>
            <CTabPanel itemKey={'form'}>
              <CContainer>
                <CRow>
                  <CCol className="mt-3 d-flex justify-content-end">
                    <CButton color="primary" size="sm" onClick={() => setGridState(!gridState)}>
                      {gridState ? (
                        <FontAwesomeIcon icon={faList} />
                      ) : (
                        <FontAwesomeIcon icon={faTh} />
                      )}
                    </CButton>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs={12} md={gridState ? 12 : 6}>
                    <CForm onSubmit={handleSubmit(onSubmit)}>
                      <CRow>
                        <CCol>
                          <h5>Screening Form</h5>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol>
                          <CFormInput
                            label="Reviewer"
                            defaultValue={`${userInformation.lastname}, ${userInformation.firstname}`}
                            readOnly
                          />
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol>
                          <CButton
                            size="sm"
                            className="aiBtn"
                            onClick={() => setIsPromptFormVisible(true)}
                          >
                            🤖 ✨ Analyze with A.I. ✨ 🤖
                          </CButton>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CCol>
                          <CFormSelect
                            label="Status"
                            {...register('status')}
                            invalid={!!errors.status}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="rejected">Rejected</option>
                            <option value="shortlisted">Shortlisted</option>
                          </CFormSelect>
                          {errors.status && (
                            <CFormFeedback invalid>{errors.status.message}</CFormFeedback>
                          )}
                        </CCol>
                      </CRow>

                      {isAnalyzing ? (
                        <CRow>
                          <CCol className="d-flex justify-content-center">
                            {config.env === 'development' ? (
                              <img
                                src="https://media.giphy.com/media/CaiVJuZGvR8HK/giphy.gif?cid=790b7611a6kx84wwwigvm5smdz0rjf07f3vzaepsszz6ay1b&ep=v1_gifs_search&rid=giphy.gif&ct=g"
                                alt="Loading..."
                                style={{ width: '100%', height: 'auto' }}
                              />
                            ) : (
                              <>
                                <CSpinner variant="grow" />
                                <span>Thinking... Beep Beep Boop Boop..</span>
                              </>
                            )}
                          </CCol>
                        </CRow>
                      ) : (
                        <>
                          <CRow className="mb-3">
                            <CCol>
                              <CFormSelect
                                label="Recommendation"
                                {...register('recommendation')}
                                invalid={!!errors.recommendation}
                              >
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                                <option value="needs further review">Needs Further Review</option>
                              </CFormSelect>
                              {errors.recommendation && (
                                <CFormFeedback invalid>
                                  {errors.recommendation.message}
                                </CFormFeedback>
                              )}
                            </CCol>
                          </CRow>
                          <CRow className="mb-3">
                            <CCol>
                              <CFormTextarea
                                label="Summary"
                                rows={12}
                                {...register('aiAnalysis.summary')}
                              />
                            </CCol>
                          </CRow>
                          {['experience', 'education', 'skills', 'motivation'].map((field) => (
                            <CRow className="mb-3" key={field}>
                              <CCol>
                                <label>
                                  {field.charAt(0).toUpperCase() + field.slice(1)} (
                                  {watch(`aiAnalysis.scoreBreakdown.${field}`)})
                                </label>
                                <CFormRange
                                  min={1}
                                  max={5}
                                  step={1}
                                  defaultValue={1}
                                  {...register(`aiAnalysis.scoreBreakdown.${field}`, {
                                    valueAsNumber: true,
                                  })}
                                />
                              </CCol>
                            </CRow>
                          ))}
                          <CRow className="mb-3">
                            <CCol>
                              <CFormTextarea
                                label="Comments"
                                rows={12}
                                {...register('aiAnalysis.comments')}
                              />
                            </CCol>
                          </CRow>
                          <CRow className="mb-3">
                            <CCol className="d-flex justify-content-end">
                              {['admin', 'reviewer', 'manager'].includes(userInformation.role) ? (
                                <CButton
                                  type="submit"
                                  color="primary"
                                  size="sm"
                                  disabled={isSubmitLoading}
                                >
                                  {isSubmitLoading ? (
                                    <>
                                      <CSpinner size="small" /> Loading...
                                    </>
                                  ) : formState === 'edit' ? (
                                    'Update'
                                  ) : (
                                    'Create'
                                  )}
                                </CButton>
                              ) : (
                                <CButton color="danger" size="sm" disabled>
                                  No Permission
                                </CButton>
                              )}
                            </CCol>
                          </CRow>
                        </>
                      )}
                    </CForm>
                  </CCol>
                  <CCol xs={12} md={gridState ? 12 : 6}>
                    <CRow className="mb-3">
                      <CCol>
                        <h5>Personal Information</h5>
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="Applicant"
                          defaultValue={`${applicant.lastname}, ${applicant.firstname}`}
                          readOnly
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput label="Email" defaultValue={applicant.email} readOnly />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput label="Phone" defaultValue={applicant.phone} readOnly />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="LinkedIn Profile"
                          defaultValue={applicant.linkedInProfile}
                          readOnly
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="Portfolio Link"
                          defaultValue={applicant.portfolioLink}
                          readOnly
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="Years of Experience"
                          defaultValue={applicant.yearsOfExperience}
                          readOnly
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="Current/Most Recent Job"
                          defaultValue={applicant.currentMostRecentJob}
                          readOnly
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="Highest Qualification"
                          defaultValue={applicant.highestQualification}
                          readOnly
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="Major Field of Study"
                          defaultValue={applicant.majorFieldOfStudy}
                          readOnly
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="Institution"
                          defaultValue={applicant.institution}
                          readOnly
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="Graduation Year"
                          defaultValue={applicant.graduationYear}
                          readOnly
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormTextarea
                          label="Cover Letter"
                          rows={6}
                          defaultValue={applicant.coverLetter}
                          readOnly
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="Salary Expectation"
                          defaultValue={applicant.salaryExpectation}
                          readOnly
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="Availability"
                          defaultValue={applicant.availability}
                          readOnly
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="Job Applied For"
                          defaultValue={applicant.jobAppliedFor}
                          readOnly
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormTextarea
                          label="Why Interested in Role"
                          rows={6}
                          defaultValue={applicant.whyInterestedInRole}
                          readOnly
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CModal
                      visible={isPromptFormVisible}
                      onClose={() => setIsPromptFormVisible(false)}
                      size="xl"
                    >
                      <CModalHeader>
                        <CModalTitle>Create a prompt</CModalTitle>
                      </CModalHeader>
                      <CModalBody>
                        <CForm onSubmit={promptSubmit(handleAnalyzeWithAI)}>
                          <CRow>
                            <CCol>
                              <p>
                                <small className="text-muted">
                                  Custom A.I. Task here. This could be anything! If Empty the system
                                  will use the default one but expect it to be not as you liked.
                                  Also, be very careful with this, this thing could break it. Leave
                                  empty if possible.
                                </small>
                              </p>
                            </CCol>
                          </CRow>
                          <CRow>
                            <CCol className="mb-3">
                              <CFormTextarea
                                label="Prompt (optional)"
                                rows={12}
                                {...promptRegister('prompt')}
                                invalid={!!promptErrors.prompt}
                              />
                              {promptErrors.prompt && (
                                <CFormFeedback invalid>{promptErrors.prompt.message}</CFormFeedback>
                              )}
                            </CCol>
                          </CRow>
                          <CRow>
                            <CCol>
                              <CButton
                                type="submit"
                                size="sm"
                                className="aiBtn"
                                disabled={isAnalyzing}
                              >
                                {!isAnalyzing ? (
                                  'Submit'
                                ) : (
                                  <>
                                    <CSpinner size="sm" /> Loading...
                                  </>
                                )}
                              </CButton>
                            </CCol>
                          </CRow>
                        </CForm>
                      </CModalBody>
                    </CModal>
                  </CCol>
                </CRow>
              </CContainer>
            </CTabPanel>
            <CTabPanel itemKey={'history'}>
              <CContainer>
                <CRow className="mb-3 mt-3">
                  <CCol>
                    <CCard>
                      <CCardBody>
                        <CTable align="middle" hover responsive striped>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell>Reviewer</CTableHeaderCell>
                              <CTableHeaderCell>Status</CTableHeaderCell>
                              <CTableHeaderCell>Recommendation</CTableHeaderCell>
                              <CTableHeaderCell>Summary</CTableHeaderCell>
                              <CTableHeaderCell>Created</CTableHeaderCell>
                              <CTableHeaderCell>Actions</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {isScreeningLoading ? (
                              <CTableRow>
                                <CTableDataCell colSpan="4">
                                  <div className="pt-3 text-center">
                                    <CSpinner color="primary" variant="grow" />
                                  </div>
                                </CTableDataCell>
                              </CTableRow>
                            ) : screenings.length === 0 ? (
                              <CTableRow>
                                <CTableDataCell colSpan="4">
                                  <div className="text-center">No Interviews Found</div>
                                </CTableDataCell>
                              </CTableRow>
                            ) : (
                              screenings.map((screen) => (
                                <CTableRow key={screen._id}>
                                  <CTableDataCell>
                                    {screen.reviewer.lastname}, {screen.reviewer.firstname}
                                  </CTableDataCell>
                                  <CTableDataCell>{screen.status}</CTableDataCell>
                                  <CTableDataCell>{screen.recommendation}</CTableDataCell>
                                  <CTableDataCell>
                                    <small>{trimString(screen.aiAnalysis.summary, 50)}</small>
                                  </CTableDataCell>
                                  <CTableDataCell>{formatDate(screen.createdAt)}</CTableDataCell>
                                  <CTableDataCell>
                                    <CButton
                                      color="primary"
                                      size="sm"
                                      onClick={() => handleSetScreening(screen)}
                                    >
                                      Edit
                                    </CButton>
                                  </CTableDataCell>
                                  {/* Add other cells here as needed */}
                                </CTableRow>
                              ))
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

ScreeningForm.propTypes = {
  isVisible: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
  state: propTypes.string.isRequired,
  applicant: propTypes.object,
}

export default ScreeningForm
