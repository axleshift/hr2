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
  CFormLabel,
  CAlert,
  CAvatar,
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const fileSchema = z
  .any()
  .transform((file) => {
    if (!file || (file instanceof FileList && file.length === 0)) return undefined;
    if (file instanceof FileList) return file.item(0);
    return file;
  })
  .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
    message: "File must be 5MB or less",
  })
  .refine((file) => !file || ACCEPTED_FILE_TYPES.includes(file.type), {
    message: "Unsupported file format",
  });

// Your full schema with file fields
const profileSchema = z.object({
  firstname: z.string().min(1).max(50),
  lastname: z.string().min(1).max(50),
  middlename: z.string().min(1).max(50),
  suffix: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  address: z.string().min(1),
  preferredWorkLocation: z.string().min(1),
  linkedInProfile: z.string().url().or(z.literal('')).optional(),
  portfolioLink: z.string().url().or(z.literal('')).optional(),
  yearsOfExperience: z.number().min(0),
  currentMostRecentJob: z.string().min(1),
  highestQualification: z.enum([
    'none',
    'elementary',
    'high school',
    'college',
    'masters',
    'phd',
  ]),
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

  // Files
  files: z
    .object({
      resume: fileSchema.optional(),
      medCert: fileSchema.optional(),
      birthCert: fileSchema.optional(),
      NBIClearance: fileSchema.optional(),
      policeClearance: fileSchema.optional(),
      TOR: fileSchema.optional(),
      idPhoto: fileSchema.optional(),
    })
    .optional(),

  // IDs
  ids: z.object({
    TIN: z.string().optional(),
    SSS: z.string().optional(),
    philHealth: z.string().optional(),
    pagIBIGFundNumber: z.string().optional(),
  }),
});

const ApplicantProfilePage = () => {
  const { applicantId } = useParams()
  const { userInformation } = useContext(AuthContext)
  const { addToast } = useContext(AppContext)
  const [applicant, setApplicant] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const [isSubmitLoading, setIsSubmitLoading] = useState(false)

  const APP_STATUS = {
    journey: [
      { key: 'isShortlisted', label: 'Shortlisted', color: 'success' },
      { key: 'isInitialInterview', label: 'Initial Interview', color: 'warning' },
      { key: 'isTechnicalInterview', label: 'Technical Interview', color: 'primary' },
      { key: 'isPanelInterview', label: 'Panel Interview', color: 'danger' },
      { key: 'isBehavioralInterview', label: 'Behavior Interview', color: 'info' },
      { key: 'isFinalInterview', label: 'Final Interview', color: 'warning' },
      { key: 'isJobOffer', label: 'Job Offer', color: 'primary' },
      { key: 'isHired', label: 'Hired / Deployment', color: 'success' },
    ],
  }

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
      setIsSubmitLoading(true);
  
      const formData = new FormData();
  
      formData.append("firstname", data.firstname);
      formData.append("lastname", data.lastname);
      formData.append("middlename", data.middlename);
      if (data.suffix) formData.append("suffix", data.suffix);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("preferredWorkLocation", data.preferredWorkLocation);
      formData.append("linkedInProfile", data.linkedInProfile || "");
      formData.append("portfolioLink", data.portfolioLink || "");
      formData.append("yearsOfExperience", String(data.yearsOfExperience));
      formData.append("currentMostRecentJob", data.currentMostRecentJob);
      formData.append("highestQualification", data.highestQualification);
      formData.append("majorFieldOfStudy", data.majorFieldOfStudy);
      formData.append("institution", data.institution);
      formData.append("graduationYear", String(data.graduationYear));
      formData.append("keySkills", data.keySkills);
      formData.append("softwareProficiency", data.softwareProficiency);
      if (data.certifications) formData.append("certifications", data.certifications);
      formData.append("coverLetter", data.coverLetter);
      formData.append("salaryExpectation", String(data.salaryExpectation));
      formData.append("availability", data.availability);
      formData.append("jobAppliedFor", data.jobAppliedFor);
      formData.append("whyInterestedInRole", data.whyInterestedInRole);
  
      formData.append("TIN", data.ids?.TIN || "");
      formData.append("SSS", data.ids?.SSS || "");
      formData.append("philHealth", data.ids?.philHealth || "");
      formData.append("pagIBIGFundNumber", data.ids?.pagIBIGFundNumber || "");
  
      if (data.files?.resume) formData.append("resume", data.files.resume);
      if (data.files?.medCert) formData.append("medCert", data.files.medCert);
      if (data.files?.birthCert) formData.append("birthCert", data.files.birthCert);
      if (data.files?.NBIClearance) formData.append("NBIClearance", data.files.NBIClearance);
      if (data.files?.policeClearance) formData.append("policeClearance", data.files.policeClearance);
      if (data.files?.TOR) formData.append("TOR", data.files.TOR);
      if (data.files?.idPhoto) formData.append("idPhoto", data.files.idPhoto);
  
      const result = await put(`/applicant/${applicant._id}`, formData)
  
      if (result.status === 200) {
        console.log(result.data)
        setApplicant(result.data);
        reset(result.data);
        addToast("Success", result.data.message, "success");
      }
    } catch (error) {
      console.error(error);
      addToast("Error", error.message || "Something went wrong", "danger");
    } finally {
      setIsSubmitLoading(false);
    }
  };

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

  const handleSendData = async () => {
    try {
      if (!confirm('Are you sure you want to send this to Employee Management?')) {
        return
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (applicantId) {
      console.log('Applicant Id', applicantId)
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
      {['admin'].includes(userInformation.role) && (
        <CRow>
          <CCol>Applicant ID: {applicantId}</CCol>
        </CRow>
      )}
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
                    <h4 className='mb-3'>Personal Information</h4>

                    <CRow xs={12} md={6} className="mb-3">
                      {/* Avatar Column */}
                      <CCol xs={12} md={6} className="d-flex justify-content-center align-items-center">
                        <img
                          className="user-image"
                          src={`https://ui-avatars.com/api/?name=${applicant?.firstname}+${applicant?.lastname}`}
                          alt="Applicant Avatar"
                          loading="lazy"
                          style={{ width: '100%', height: 'auto', maxWidth: '200px' }} // Ensure image fits correctly
                        />
                      </CCol>

                      {/* Form Column */}
                      <CCol xs={12} md={6} className="mb-3">
                        <CFormInput
                          label="Firstname"
                          invalid={!!errors.firstname}
                          {...register('firstname')}
                        />
                        {errors.firstname && (
                          <CFormFeedback invalid>{errors.firstname.message}</CFormFeedback>
                        )}
                        <CFormInput
                          label="Lastname"
                          invalid={!!errors.lastname}
                          {...register('lastname')}
                        />
                        {errors.lastname && (
                          <CFormFeedback invalid>{errors.lastname.message}</CFormFeedback>
                        )}

                        <CFormInput
                          label="Middlename"
                          invalid={!!errors.middlename}
                          {...register('middlename')}
                        />
                        {errors.middlename && (
                          <CFormFeedback invalid>{errors.middlename.message}</CFormFeedback>
                        )}

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
                        <CFormInput label="Email" invalid={!!errors.email} {...register('email')} />
                        {errors.email && (
                          <CFormFeedback invalid>{errors.email.message}</CFormFeedback>
                        )}
                      </CCol>
                      <CCol>
                        <CFormInput label="Phone" invalid={!!errors.phone} {...register('phone')} />
                        {errors.phone && (
                          <CFormFeedback invalid>{errors.phone.message}</CFormFeedback>
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
                    <h4>Application Status</h4>
                    <CRow>
                      {APP_STATUS.journey.map((status) => (
                        <CCol xs={12} md={6} lg={4} className="mb-3" key={status.key}>
                          <CAlert color={applicant?.statuses?.journey &&
                            status.key in applicant.statuses.journey
                            ? applicant.statuses.journey[status.key]
                              ? 'success'
                              : 'danger'
                            : 'info'} className="p-3 border-0 rounded shadow-sm">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <CFormLabel className="fw-bold">{status.label}</CFormLabel>
                                <div>
                                  {applicant?.statuses?.journey &&
                                    status.key in applicant.statuses.journey
                                    ? applicant.statuses.journey[status.key]
                                      ? 'Yes'
                                      : 'No'
                                    : 'N/A'}
                                </div>
                              </div>
                              {['admin', 'manager'].includes(userInformation.role) ? (
                                <CButton
                                  color="info"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleStatUpdate(status.key)}
                                  className="ms-2"
                                >
                                  Update
                                </CButton>
                              ) : (
                                <p>No Permission</p>
                              )}
                            </div>
                          </CAlert>
                        </CCol>
                      ))}
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
                    {['admin', 'manager', 'recruiters'].includes(userInformation.role) && (
                      <>
                        <h4>Pre-employment Requirements</h4>
                        <CRow className='mb-3'>
                          <CCol>
                            <CFormInput
                              label="TIN"
                              invalid={!!errors.ids?.TIN}
                              {...register('ids.TIN')} />
                            {errors.ids?.TIN && (
                              <CFormFeedback invalid>{errors.ids.TIN.message}</CFormFeedback>
                            )}
                          </CCol>
                          <CCol>
                            <CFormInput
                              label="SSS"
                              invalid={!!errors.ids?.SSS}
                              {...register('ids.SSS')} />
                            {errors.ids?.SSS && (
                              <CFormFeedback invalid>{errors.ids.SSS.message}</CFormFeedback>
                            )}
                          </CCol>
                        </CRow>
                        <CRow className='mb-3'>
                          <CCol>
                            <CFormInput
                              label="PhilHealth"
                              invalid={!!errors.ids?.philHealth}
                              {...register('ids.philHealth')} />
                            {errors.ids?.philHealth && (
                              <CFormFeedback invalid>{errors.ids.philHealth.message}</CFormFeedback>
                            )}
                          </CCol>
                          <CCol>
                            <CFormInput
                              label="PagIBIG Fund Number"
                              invalid={!!errors.ids?.pagIBIGFundNumber}
                              {...register('ids.pagIBIGFundNumber')} />
                            {errors.ids?.pagIBIGFundNumber && (
                              <CFormFeedback invalid>{errors.ids.pagIBIGFundNumber.message}</CFormFeedback>
                            )}
                          </CCol>
                        </CRow>
                        <h5>Required Documents</h5>
                        <CRow className='mb-3'>
                          <CCol>
                            <CFormInput
                              type='file'
                              label="Resume"
                              invalid={!!errors.files?.resume}
                              {...register('files.resume')} />
                            {errors.files?.resume && (
                              <CFormFeedback invalid>{errors.files.resume.message}</CFormFeedback>
                            )}
                          </CCol>
                          <CCol>
                            <CFormInput
                              type='file'
                              label="Medical Certificate"
                              invalid={!!errors.files?.medCert}
                              {...register('files.medCert')} />
                            {errors.files?.medCert && (
                              <CFormFeedback invalid>{errors.files.medCert.message}</CFormFeedback>
                            )}
                          </CCol>
                        </CRow>
                        <CRow className='mb-3'>
                          <CCol>
                            <CFormInput
                              type='file'
                              label="Birth Certificate"
                              invalid={!!errors.files?.birthCert}
                              {...register('files.birthCert')} />
                            {errors.files?.birthCert && (
                              <CFormFeedback invalid>{errors.files.birthCert.message}</CFormFeedback>
                            )}
                          </CCol>
                          <CCol>
                            <CFormInput
                              type='file'
                              label="NBI Clearance"
                              invalid={!!errors.files?.NBIClearance}
                              {...register('files.NBIClearance')} />
                            {errors.files?.NBIClearance && (
                              <CFormFeedback invalid>{errors.files.NBIClearance.message}</CFormFeedback>
                            )}
                          </CCol>
                        </CRow>
                        <CRow className='mb-3'>
                          <CCol>
                            <CFormInput
                              type='file'
                              label="Police Clearance"
                              invalid={!!errors.files?.policeClearance}
                              {...register('files.policeClearance')} />
                            {errors.files?.policeClearance && (
                              <CFormFeedback invalid>{errors.files.policeClearance.message}</CFormFeedback>
                            )}
                          </CCol>
                          <CCol>
                            <CFormInput
                              type='file'
                              label="Transcript of Record"
                              invalid={!!errors.files?.TOR}
                              {...register('files.TOR')} />
                            {errors.files?.TOR && (
                              <CFormFeedback invalid>{errors.files.TOR.message}</CFormFeedback>
                            )}
                          </CCol>
                        </CRow>
                      </>
                    )}
                    <CRow>
                      <CCol className="d-flex justify-content-between d-flex-column gap-2">
                        <div className='d-flex gap-2'>
                          {['admin', 'manager', 'recruiter'].includes(userInformation.role) && (
                            <CButton
                              color="danger"
                              size="sm"
                              onClick={() => handleDelete(applicant._id)}
                            >
                              Delete
                            </CButton>
                          )}
                          {['admin', 'manager', 'recruiter'].includes(userInformation.role) && (
                            <CButton
                              color="warning"
                              size="sm"
                            // onClick={() => handleDelete(applicant._id)}
                            >
                              Reject
                            </CButton>
                          )}
                        </div>
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
