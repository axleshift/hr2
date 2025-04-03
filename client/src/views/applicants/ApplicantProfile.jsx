import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CFormFeedback,
  CButton,
  CFormTextarea,
  CFormSelect,
  CCard,
  CCardBody,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
  CListGroup,
  CListGroupItem,
  CTooltip,
  CSpinner,
  CInputGroupText,
} from '@coreui/react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { get, put } from '../../api/axios'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AppContext } from '../../context/appContext'

import EventTab from './tabs/EventTab'
import DocsTab from './tabs/DocsTab'
import { AuthContext } from '../../context/authContext'

const profileSchema = z.object({
  firstname: z.string().min(1).max(50),
  lastname: z.string().min(1).max(50),
  middlename: z.string().min(1).max(50),
  suffix: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  address: z.string().min(1),
  preferredWorkLocation: z.string().min(1),
  linkedInProfile: z.string().url().optional(),
  portfolioLink: z.string().url().optional(),
  yearsOfExperience: z.number().min(0),
  currentMostRecentJob: z.string().min(1),
  // highestQualification: z.string().min(1),
  highestQualification: z.enum(['none', 'elementary', 'high school', 'college', 'masters', 'phd']),
  majorFieldOfStudy: z.string().min(1),
  institution: z.string().min(1),
  graduationYear: z.number().min(1900).max(new Date().getFullYear()),
  keySkills: z.string().min(1),
  softwareProficiency: z.string().min(1),
  certifications: z.string().optional(),
  coverLetter: z.string().min(1),
  salaryExpectation: z.number().min(0),
  availability: z.string().min(1),
  jobAppliedFor: z.string().min(1),
  whyInterestedInRole: z.string().min(1),
})

const ApplicantProfilePage = () => {
  const { applicantId } = useParams()
  const { userInformation } = useContext(AuthContext)
  const { addToast } = useContext(AppContext)
  const [applicant, setApplicant] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const [isSubmitLoading, setIsSubmitLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
  })

  const getApplicant = async (id) => {
    if (!id) return
    try {
      setIsLoading(true)
      console.log('Applicant Id', id)
      const res = await get(`/applicant/${id}`)

      if (res.status === 200) {
        const app = res.data.data
        console.log('App', JSON.stringify(app, null, 2))
        setApplicant(res.data.data)
        reset(app)
      } else {
        addToast('error', res.message.message, 'danger')
      }
    } catch (error) {
      console.error('API Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateApplicant = async (data) => {
    try {
      setIsSubmitLoading(true)
      const res = await put(`/applicant/${applicant._id}`, data)
      if (res.status === 200) {
        setApplicant(res.data.data)
        reset(res.data.data)
        addToast('Success', res.data.message, 'success')
      } else {
        addToast('Error', res.message.message, 'danger')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      if (!confirm('Are you sure you want to delete this record?')) {
        return
      }
      const res = await del(`/applicant/${id}`)
      if (res.status === 200) {
        addToast('Success', res.data.message, 'success')
        getAllData()
      } else {
        addToast('Error', 'An error occurred', 'danger')
      }
    } catch (error) {
      addToast('Error', 'An error occurred', 'danger')
    }
  }

  const handleStatUpdate = async (stat) => {
    try {
      if (!confirm(`Are you sure you want to update ${stat} to opposite value?`)) {
        return
      }
      console.log('Stat', stat)
      setIsSubmitLoading(true)
      const res = await put(`/applicant/status/${applicantId}/${stat}`)
      console.log('Stat', JSON.stringify(res.data?.data, null, 2))
      if (res.status === 200) {
        reset(res.data.data)
        setApplicant(res.data.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitLoading(false)
    }
  }

  useEffect(() => {
    if (applicantId) {
      getApplicant(applicantId)
    }
  }, [applicantId])

  return (
    <>
      <CRow>
        <CCol>
          <h1>Applicant Profile</h1>
        </CCol>
      </CRow>
      <CRow className="mb-3 mt-3">
        <CTabs activeItemKey={'form'}>
          <CTabList variant="tabs">
            <CTab itemKey={'form'}>Information</CTab>
            <CTab itemKey={'event'}>Events</CTab>
            <CTab itemKey={'docs'}> Documentations</CTab>
          </CTabList>
          <CTabContent>
            <CTabPanel itemKey={'form'}>
              <CContainer className="mt-3 mb-3">
                {isSubmitLoading ? (
                  <CRow>
                    <CCol>
                      <CSpinner size="sm" />
                    </CCol>
                  </CRow>
                ) : (
                  <CForm onSubmit={handleSubmit(updateApplicant)}>
                    {/* Personal Information Section */}
                    <h4>Applicantion Statuses</h4>
                    <CRow className="mb-3">
                      <CCol>
                        <CInputGroup>
                          <CInputGroupText>Shotlisted</CInputGroupText>
                          <CFormInput readOnly defaultValue={applicant?.isShortlisted} />
                          <CButton
                            color="info"
                            size="sm"
                            onClick={() => handleStatUpdate('isShortlisted')}
                          >
                            Update
                          </CButton>
                        </CInputGroup>
                      </CCol>
                      <CCol>
                        <CInputGroup>
                          <CInputGroupText>Initial Interview?</CInputGroupText>
                          <CFormInput readOnly defaultValue={applicant?.isInitialInterview} />
                          <CButton
                            color="info"
                            size="sm"
                            onClick={() => handleStatUpdate('isInitialInterview')}
                          >
                            Update
                          </CButton>
                        </CInputGroup>
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CInputGroup>
                          <CInputGroupText>Final Interview?</CInputGroupText>
                          <CFormInput readOnly defaultValue={applicant?.isFinalInterview} />
                          <CButton
                            color="info"
                            size="sm"
                            onClick={() => handleStatUpdate('isFinalInterview')}
                          >
                            Update
                          </CButton>
                        </CInputGroup>
                      </CCol>
                      <CCol>
                        <CInputGroup>
                          <CInputGroupText>Is Hired?</CInputGroupText>
                          <CFormInput readOnly defaultValue={applicant?.isHired} />
                          <CButton
                            color="info"
                            size="sm"
                            onClick={() => handleStatUpdate('isHired')}
                          >
                            Update
                          </CButton>
                        </CInputGroup>
                      </CCol>
                    </CRow>
                    <h4>Personal Information</h4>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="Firstname"
                          invalid={!!errors.firstname}
                          {...register('firstname')}
                        />
                        {errors.firstname && (
                          <CFormFeedback invalid>{errors.firstname.message}</CFormFeedback>
                        )}
                      </CCol>
                      <CCol>
                        <CFormInput
                          label="Lastname"
                          invalid={!!errors.lastname}
                          {...register('lastname')}
                        />
                        {errors.lastname && (
                          <CFormFeedback invalid>{errors.lastname.message}</CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="Middlename"
                          invalid={!!errors.middlename}
                          {...register('middlename')}
                        />
                        {errors.middlename && (
                          <CFormFeedback invalid>{errors.middlename.message}</CFormFeedback>
                        )}
                      </CCol>
                      <CCol>
                        <CFormInput
                          label="Suffix"
                          invalid={!!errors.suffix}
                          {...register('suffix')}
                        />
                        {errors.suffix && (
                          <CFormFeedback invalid>{errors.suffix.message}</CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="Address"
                          invalid={!!errors.address}
                          {...register('address')}
                        />
                        {errors.address && (
                          <CFormFeedback invalid>{errors.address.message}</CFormFeedback>
                        )}
                      </CCol>
                      <CCol>
                        <CFormInput
                          label="Preferred Work Location"
                          invalid={!!errors.preferredWorkLocation}
                          {...register('preferredWorkLocation')}
                        />
                        {errors.preferredWorkLocation && (
                          <CFormFeedback invalid>
                            {errors.preferredWorkLocation.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="LinkedIn Profile"
                          invalid={!!errors.linkedInProfile}
                          {...register('linkedInProfile')}
                        />
                        {errors.linkedInProfile && (
                          <CFormFeedback invalid>{errors.linkedInProfile.message}</CFormFeedback>
                        )}
                      </CCol>
                      <CCol>
                        <CFormInput
                          label="Portfolio Link"
                          invalid={!!errors.portfolioLink}
                          {...register('portfolioLink')}
                        />
                        {errors.portfolioLink && (
                          <CFormFeedback invalid>{errors.portfolioLink.message}</CFormFeedback>
                        )}
                      </CCol>
                    </CRow>

                    {/* Work Information Section */}
                    <h4>Work Information</h4>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormSelect
                          id="highestQualification"
                          label="Highest Qualification"
                          {...register('highestQualification')}
                          invalid={!!errors.highestQualification}
                          options={[
                            { value: 'none', label: 'None' },
                            { value: 'elementary', label: 'Elementary' },
                            { value: 'high school', label: 'High School' },
                            { value: 'college', label: 'College' },
                            { value: 'masters', label: 'Masters' },
                            { value: 'phd', label: 'PhD' },
                          ]}
                        />
                        {errors.highestQualification && (
                          <CFormFeedback className="text-danger">
                            {errors.highestQualification.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                      <CCol>
                        <CFormInput
                          label="Major Field of Study"
                          invalid={!!errors.majorFieldOfStudy}
                          {...register('majorFieldOfStudy')}
                        />
                        {errors.majorFieldOfStudy && (
                          <CFormFeedback invalid>{errors.majorFieldOfStudy.message}</CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="Institution"
                          invalid={!!errors.institution}
                          {...register('institution')}
                        />
                        {errors.institution && (
                          <CFormFeedback invalid>{errors.institution.message}</CFormFeedback>
                        )}
                      </CCol>
                      <CCol>
                        <CFormInput
                          label="Graduation Year"
                          type="number"
                          invalid={!!errors.graduationYear}
                          {...register('graduationYear')}
                        />
                        {errors.graduationYear && (
                          <CFormFeedback invalid>{errors.graduationYear.message}</CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="Years of Experience"
                          type="number"
                          invalid={!!errors.yearsOfExperience}
                          {...register('yearsOfExperience')}
                        />
                        {errors.yearsOfExperience && (
                          <CFormFeedback invalid>{errors.yearsOfExperience.message}</CFormFeedback>
                        )}
                      </CCol>
                      <CCol>
                        <CFormInput
                          label="Current/Most Recent Job"
                          invalid={!!errors.currentMostRecentJob}
                          {...register('currentMostRecentJob')}
                        />
                        {errors.currentMostRecentJob && (
                          <CFormFeedback invalid>
                            {errors.currentMostRecentJob.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormTextarea
                          label="Key Skills"
                          invalid={!!errors.keySkills}
                          {...register('keySkills')}
                        />
                        {errors.keySkills && (
                          <CFormFeedback invalid>{errors.keySkills.message}</CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormTextarea
                          label="Software Proficiency"
                          invalid={!!errors.softwareProficiency}
                          {...register('softwareProficiency')}
                        />
                        {errors.softwareProficiency && (
                          <CFormFeedback invalid>
                            {errors.softwareProficiency.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormTextarea
                          label="Certifications"
                          invalid={!!errors.certifications}
                          {...register('certifications')}
                        />
                        {errors.certifications && (
                          <CFormFeedback invalid>{errors.certifications.message}</CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormTextarea
                          label="Cover Letter"
                          rows={6}
                          invalid={!!errors.coverLetter}
                          {...register('coverLetter')}
                        />
                        {errors.coverLetter && (
                          <CFormFeedback invalid>{errors.coverLetter.message}</CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="Salary Expectation"
                          type="number"
                          invalid={!!errors.salaryExpectation}
                          {...register('salaryExpectation')}
                        />
                        {errors.salaryExpectation && (
                          <CFormFeedback invalid>{errors.salaryExpectation.message}</CFormFeedback>
                        )}
                      </CCol>
                      <CCol>
                        <CFormInput
                          label="Availability"
                          invalid={!!errors.availability}
                          {...register('availability')}
                        />
                        {errors.availability && (
                          <CFormFeedback invalid>{errors.availability.message}</CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormInput
                          label="Job Applied For"
                          invalid={!!errors.jobAppliedFor}
                          {...register('jobAppliedFor')}
                        />
                        {errors.jobAppliedFor && (
                          <CFormFeedback invalid>{errors.jobAppliedFor.message}</CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol>
                        <CFormTextarea
                          label="Why Interested In Role"
                          rows={6}
                          invalid={!!errors.whyInterestedInRole}
                          {...register('whyInterestedInRole')}
                        />
                        {errors.whyInterestedInRole && (
                          <CFormFeedback invalid>
                            {errors.whyInterestedInRole.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                    </CRow>

                    <CRow>
                      <CCol className="d-flex justify-content-between d-flex-column gap-2">
                        {['admin', 'manager', 'recruiter'].includes(userInformation.role) && (
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => handleDelete(applicant._id)}
                          >
                            Delete
                          </CButton>
                        )}
                        <CButton type="submit" color="primary" size="sm" disabled={isSubmitLoading}>
                          {isSubmitLoading ? (
                            <>
                              <CSpinner size="sm" />
                              <span>Loading..</span>
                            </>
                          ) : (
                            'Update'
                          )}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                )}
              </CContainer>
            </CTabPanel>
            <CTabPanel itemKey={'event'}>
              <EventTab applicantId={applicantId} />
            </CTabPanel>
            <CTabPanel itemKey={'docs'}>
              <DocsTab applicantId={applicantId} />
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </CRow>
    </>
  )
}

export default ApplicantProfilePage
