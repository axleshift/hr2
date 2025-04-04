import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../../context/authContext'
import propTypes from 'prop-types'
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CButton,
  CFormCheck,
  CFormFeedback,
  CFormSelect,
  CTooltip,
  CSpinner,
} from '@coreui/react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { get, post, put } from '../../../api/axios'
import { AppContext } from '../../../context/appContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faMailForward } from '@fortawesome/free-solid-svg-icons'

const OFFER_STATUSES = ['Pending', 'Accepted', 'Declined']

const jobofferSchema = z.object({
  position: z.string().min(1).max(30),
  salary: z.coerce.number().min(1).default(1),
  // startDate: z.date(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
  benefits: z.string().min(1, { message: 'Benefits is required' }),
  status: z.enum(['Pending', 'Accepted', 'Declined']),
  notes: z.string().optional(),
  approvedBy: z.string().optional(),
  // approvedDate: z.string().optional(),
  approvedDate: z
    .string()
    .optional()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
})

const JobOfferForm = ({ isVisible, onClose, state, interview, joboffer }) => {
  const { addToast } = useContext(AppContext)
  const { userInformation } = useContext(AuthContext)

  const [isConfirmed, setIsConfirmed] = useState(false)

  const [jobofferData, setJobofferData] = useState({})
  const [interviewData, setInterviewData] = useState({})

  const [isSubmitLoading, setIsSubmitLoading] = useState(false)

  const [isEmailLoading, setIsEmailLoading] = useState(false)

  const [isFormLoading, setIsFormLoading] = useState(false)

  const [formState, setFormState] = useState('view')
  const [isFormVisible, setIsFormVisible] = useState(false)

  const [isApproved, setIsApproved] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: async (data, context, options) => {
      const result = await zodResolver(jobofferSchema)(data, context, options)
      console.log('Validation result:', result)
      return result
    },
  })

  const jobofferSubmit = async (data) => {
    try {
      setIsSubmitLoading(true)
      const appId = interviewData.applicant?._id
      const res =
        formState === 'edit'
          ? await put(`/applicant/joboffer/${jobofferData._id}?isApproved=${isApproved}`, data)
          : await post(`/applicant/joboffer/${appId}`, data)

      console.log('res', JSON.stringify(res.data, null, 2))

      switch (res.status) {
        case 201:
          addToast('Success', res.data.message, 'success')
          setJobofferData(res.data.data)
          break
        case 200:
          addToast('Success', res.data.message, 'success')
          setJobofferData(res.data.data)
          break

        default:
          addToast('Error', res.message.message, 'danger')
          break
      }
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitLoading(false)
    }
  }

  const getJoboffer = async (joboffer) => {
    try {
      setIsFormLoading(true)
      const res = await get(`/applicant/joboffer/${joboffer._id}`)
      if (res.status === 200) {
        setJobofferData(res.data.data)
        reset(res.data.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsFormLoading(false)
    }
  }

  const handleSendEmail = async (jobofferId) => {
    try {
      setIsEmailLoading(true)
      console.log(jobofferId)
      const res = await post(`/applicant/joboffer/send-email/${jobofferId}`)
      console.log('job Offer Email', JSON.stringify(res.data, null, 2))

      if (res.status === 200) {
        addToast('Success', res.data.message, 'success')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsEmailLoading(false)
    }
  }

  useEffect(() => {
    if (isVisible) {
      console.log('Stae', JSON.stringify(formState))
      setIsFormVisible(isVisible)

      if (interview) {
        setInterviewData(interview)
        reset({
          position: interview.job ?? 'No Data',
          startDate: new Date(interview.date).toISOString().split('T')[0],
          salary: interview.salaryExpectation,
          status: 'Pending',
        })
      }

      if (joboffer) {
        setJobofferData(joboffer)
        reset({
          position: joboffer.position ?? 'No Data',
          startDate: new Date(joboffer.startDate).toISOString().split('T')[0],
          salary: joboffer.salary,
          status: joboffer.status,
          benefits: joboffer.benefits,
          notes: joboffer.notes,
          approvedBy: joboffer.approvedBy
            ? `${joboffer.approvedBy.lastname}, ${joboffer.approvedBy.firstname}`
            : '',
          approvedDate: joboffer.approvedDate
            ? new Date(joboffer.approvedDate).toISOString().split('T')[0]
            : new Date(),
        })
      }
    }
  }, [isVisible, interview, joboffer, formState])

  useForm(() => {
    if (formState) {
      if (formState === 'edit' || formState === 'create') {
        setIsReadOnly(false)
      }
    }
  }, [formState])

  useEffect(() => {
    if (state) {
      setFormState(state)
    }
  }, [state])

  return (
    <CModal
      visible={isFormVisible}
      size="lg"
      onClose={() => {
        onClose()
        setIsFormVisible(false)
      }}
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle className="text-capitalize">
          {formState === 'edit' ? 'Update Job Offer' : 'Create Job Offer'}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {isFormLoading ? (
          <CRow>
            <CCol>
              <CSpinner size="sm" /> Loading..
            </CCol>
          </CRow>
        ) : (
          <CRow>
            <CCol>
              <CForm onSubmit={handleSubmit(jobofferSubmit)}>
                <CRow className="mb-3">
                  <CCol>
                    <CFormInput
                      label="Position / job Applied For?"
                      {...register('position')}
                      invalid={!!errors.position}
                      readOnly={['view', 'edit', 'create'].includes(formState)}
                    />
                    {errors.position && (
                      <CFormFeedback invalid>{errors.position.message}</CFormFeedback>
                    )}
                  </CCol>
                  <CCol>
                    <CFormInput
                      type="number"
                      label="Salary"
                      {...register('salary', { valueAsNumber: true })}
                      invalid={!!errors.salary}
                      readOnly={['view'].includes(formState)}
                    />
                    {errors.salary && (
                      <CFormFeedback invalid>{errors.salary.message}</CFormFeedback>
                    )}
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <CTooltip placement="top" content="When the new hire is expected to start.">
                      <CFormLabel>Start Date</CFormLabel>
                    </CTooltip>

                    <CFormInput
                      type="date"
                      {...register('startDate')}
                      readOnly={['view'].includes(formState)}
                    />
                    {errors.startDate && (
                      <CFormFeedback invalid>{errors.startDate.message}</CFormFeedback>
                    )}
                  </CCol>
                  <CCol>
                    <CFormSelect
                      label="Job Offer Status"
                      {...register('status')}
                      invalid={!!errors.status}
                      disabled={['view'].includes(formState)}
                    >
                      {OFFER_STATUSES.map((o, index) => {
                        return (
                          <option key={index} value={o}>
                            {o}
                          </option>
                        )
                      })}
                    </CFormSelect>
                  </CCol>
                </CRow>
                {jobofferData?.approvedBy && (
                  <CRow className="mb-3">
                    <CCol>
                      <CFormInput
                        label="Approved By"
                        {...register('approvedBy')}
                        invalid={!!errors.approvedBy}
                        readOnly
                      />
                      {errors.approvedBy && (
                        <CFormFeedback invalid>{errors.approvedBy.message}</CFormFeedback>
                      )}
                    </CCol>
                    <CCol>
                      <CFormInput
                        type="date"
                        label="Approved Date"
                        {...register('approvedDate')}
                        readOnly
                      />
                      {errors.approvedDate && (
                        <CFormFeedback invalid>{errors.approvedDate.message}</CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                )}
                <CRow className="mb-3">
                  <CCol>
                    <CFormTextarea
                      label="Benefits"
                      rows={6}
                      {...register('benefits')}
                      readOnly={['view'].includes(formState)}
                      invalid={!!errors.benefits}
                    />
                    {errors.benefits && (
                      <CFormFeedback invalid>{errors.benefits.message}</CFormFeedback>
                    )}
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <CFormTextarea
                      label="Notes"
                      rows={6}
                      {...register('notes')}
                      readOnly={['view'].includes(formState)}
                    />
                    {errors.notes && <CFormFeedback invalid>{errors.notes.message}</CFormFeedback>}
                  </CCol>
                </CRow>
                {!joboffer.approvedBy && (
                  <CRow>
                    <CCol>
                      <CButton
                        color={isApproved ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setIsApproved(!isApproved)}
                      >
                        {isApproved ? 'Approve' : 'Disapproved'}
                      </CButton>
                    </CCol>
                  </CRow>
                )}
                <CRow>
                  <CCol className="d-flex justify-content-end">
                    <CFormCheck
                      label="I confirm that details above are correct and true."
                      defaultChecked={!isConfirmed}
                      onChange={() => setIsConfirmed(!isConfirmed)}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol className="d-flex justify-content-end gap-2">
                    {!joboffer.emailSent && joboffer.approvedBy && (
                      <CButton
                        color="info"
                        size="sm"
                        disabled={isConfirmed || isSubmitLoading || isEmailLoading}
                        onClick={() => handleSendEmail(joboffer._id)}
                      >
                        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                        {isEmailLoading ? 'Loading... ' : 'Send Job offer Mail'}
                      </CButton>
                    )}
                    <CButton
                      type="submit"
                      color="primary"
                      size="sm"
                      disabled={isConfirmed || isSubmitLoading}
                    >
                      {isSubmitLoading ? (
                        <>
                          <CSpinner size="sm" /> Loading...
                        </>
                      ) : formState === 'create' ? (
                        'Issue Job Offer'
                      ) : (
                        'Update Job Offer'
                      )}
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCol>
          </CRow>
        )}
      </CModalBody>
    </CModal>
  )
}

JobOfferForm.propTypes = {
  isVisible: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
  state: propTypes.string.isRequired,
  interview: propTypes.object,
  joboffer: propTypes.object,
}

export default JobOfferForm
