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
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { formatDate } from '../../../utils'

const OFFER_STATUSES = ['Pending', 'Accepted', 'Declined']
const JOB_TYPES = ['Contractual', 'Regular', 'Temporary', 'Freelance']

const jobofferSchema = z.object({
  position: z.string().min(1).max(30),
  salary: z.coerce.number().min(1).default(1),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
  benefits: z.string().min(1, { message: 'Benefits are required' }),
  jobType: z.enum(JOB_TYPES),
  contractDuration: z.string().optional(),
  location: z.string().min(1, { message: 'Location is required' }),
  status: z.enum(OFFER_STATUSES),
  notes: z.string().optional(),
})

const JobOfferForm = ({ isVisible, onClose, state, joboffer, applicantData }) => {
  const { addToast } = useContext(AppContext)
  const { userInformation } = useContext(AuthContext)
  const [applicant, setApplicant] = useState([])
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [jobofferData, setJobofferData] = useState({})
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
      console.log('clicked', data)
      setIsSubmitLoading(true)

      const formData = {
        position: data.position,
        salary: data.salary,
        startDate: data.startDate,
        benefits: data.benefits,
        notes: data.notes,
        jobType: data.jobType,
        contractDuration: data.contractDuration,
        location: data.location,
        status: data.status,
      }

      const appId = applicant._id
      const res =
        formState === 'edit'
          ? await put(`/applicant/joboffer/${jobofferData._id}?isApproved=${isApproved}`, formData)
          : await post(`/applicant/joboffer/${appId}`, formData)

      if (res.status === 200 || res.status === 201) {
        addToast('Success', res.data.message, 'success')
        setFormState('edit')
        setJobofferData(res.data.data)
        reset(res.data.data)
      } else {
        addToast('Error', res.message.message, 'danger')
      }

      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitLoading(false)
    }
  }

  const handleSendEmail = async (jobofferId) => {
    try {
      setIsEmailLoading(true)
      const res = await post(`/applicant/joboffer/send-email/${jobofferId}`)
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
      setIsFormVisible(isVisible)

      if (applicant) {
        setApplicant(applicantData)
      }

      if (joboffer) {
        setJobofferData(joboffer)
        setApplicant(joboffer.applicant)
        reset({
          position: joboffer.position ?? 'No Data',
          startDate: joboffer.startDate
            ? new Date(joboffer.startDate).toISOString().split('T')[0]
            : 'No Data',
          salary: joboffer.salary,
          status: joboffer.status ?? 'Pending', // Ensuring default value
          benefits: joboffer.benefits,
          notes: joboffer.notes,
          jobType: joboffer.jobType ?? 'Regular', // New field for job type
          contractDuration: joboffer.contractDuration ?? '',
          location: joboffer.location ?? '',
        })
      } else {
        reset({
          position: applicant.jobAppliedFor,
          location: applicant.preferredWorkLocation,
        })
      }
    }
  }, [isVisible, joboffer, formState])

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
                <CRow>
                  <CCol>
                    <h4>
                      {applicant.lastname}, {applicant.firstname} {applicant.middlename}{' '}
                      {applicant.suffix && applicant.suffix}
                    </h4>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <CFormInput
                      label="Position / Job Applied For"
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
                      label="Salary per month"
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
                      label="Job Type"
                      {...register('jobType')}
                      invalid={!!errors.jobType}
                      disabled={['view'].includes(formState)}
                    >
                      {JOB_TYPES.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                    </CFormSelect>
                    {errors.jobType && (
                      <CFormFeedback invalid>{errors.jobType.message}</CFormFeedback>
                    )}
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol>
                    <CFormSelect
                      label="Offer Status"
                      {...register('status')}
                      invalid={!!errors.status}
                      disabled={['view'].includes(formState)}
                    >
                      {OFFER_STATUSES.map((status, index) => (
                        <option key={index} value={status}>
                          {status}
                        </option>
                      ))}
                    </CFormSelect>
                    {errors.status && (
                      <CFormFeedback invalid>{errors.status.message}</CFormFeedback>
                    )}
                  </CCol>
                  <CCol>
                    <CFormInput
                      label="Location"
                      {...register('location')}
                      invalid={!!errors.location}
                      readOnly={['view'].includes(formState)}
                    />
                    {errors.location && (
                      <CFormFeedback invalid>{errors.location.message}</CFormFeedback>
                    )}
                  </CCol>
                </CRow>
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
                {!joboffer?.approvedBy && (
                  <CRow>
                    <CCol>
                      <CButton
                        color={isApproved ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setIsApproved(!isApproved)}
                      >
                        {isApproved ? 'Approve' : 'Disapprove'}
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
                  {joboffer?.approvedBy && (
                    <CCol>
                      <p>
                        Approved Date: {formatDate(jobofferData.approvedDate)}
                        <br />
                        Approved By:{' '}
                        {(jobofferData.approvedBy.lastname, jobofferData.approvedBy.firstname)}
                      </p>
                    </CCol>
                  )}
                  <CCol className="d-flex justify-content-end gap-2">
                    {!joboffer?.emailSent && joboffer?.approvedBy && (
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
                      ) : formState === 'edit' ? (
                        'Update'
                      ) : (
                        'Submit'
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
  state: propTypes.string,
  joboffer: propTypes.object,
  applicantData: propTypes.object,
}

export default JobOfferForm
