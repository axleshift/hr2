/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useContext } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { post, put, get, del, getFile } from '../../api/axios'

import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CForm,
  CFormTextarea,
  CFormLabel,
  CFormInput,
  CFormFeedback,
  CButtonGroup,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTooltip,
  CInputGroup,
  CBadge,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CSpinner,
  CFormSelect,
} from '@coreui/react'
import AppPagination from '../../components/AppPagination'
import { pdfjs, Document, Page } from 'react-pdf'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AppContext } from '../../context/appContext'
import {
  faPlus,
  faTrash,
  faRefresh,
  faPencil,
  faSearch,
  faUser,
  faEye,
  faMobileScreenButton,
  faBolt,
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons'
import { firstLetterUppercase } from '../../utils'
import { config } from '../../config'
import DocumentForm from './modal/DocumentForm'
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const Screening = () => {
  const { addToast } = useContext(AppContext)

  const [isFormModalVisible, setIsFormModalVisible] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  // Data states
  const [applicantData, setApplicantData] = useState({})
  const [applicants, setApplicants] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Search states
  const [searchInput, setSearchInput] = useState('')
  const [isSearchMode, setSearchMode] = useState(false)

  // Form Elements states
  const [isEdit, setIsEdit] = useState(false)
  const [isFormChecked, setIsFormChecked] = useState(false)
  const [selectedApplicantID, setSelectedApplicantID] = useState('')
  const [selectedApplicant, setSelectedApplicant] = useState({})

  // Tags
  const [formTags, setFormTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [isTagLoading, setTagLoading] = useState(false)
  const [isTagModalVisible, setTagModalVisible] = useState(false)

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  // Screening
  const [isScreeningFormModalVisible, setScreeningFormModalVisible] = useState(false)
  const [isScreeningHistoryModalVisible, setIsScreeningHistoryModalVisible] = useState(false)

  const [pdfFile, setPdfFile] = useState(null)
  const [pdfScale, setPdfScale] = useState(1.0)

  const applicantSchema = z.object({
    id: z.string().optional(),
    firstname: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters long' })
      .max(255, { message: 'First name must be at most 255 characters long' }),
    lastname: z
      .string()
      .min(2, { message: 'Last name must be at least 3 characters long' })
      .max(255, { message: 'Last name must be at most 255 characters long' }),
    middlename: z.string().optional(),
    suffix: z.string().optional(),
    email: z.string().email(),
    phone: z
      .string()
      .min(10)
      .max(20)
      .refine(
        (phone) => {
          /**
           * sample of regex for phone number validation
           * valids: 09123456789, 0912-345-6789, 0912 345 6789, 0912.345.6789
           * invalids: 0912-345-6789-123, 0912-345-6789-123-123
           */
          return phone.match(/^[0-9]+$/) !== null
        },
        { message: 'Phone number must be numeric' },
      ),
    address: z.string().min(10).max(255),
    prefferedWorkLocation: z.enum(['Remote', 'Onsite', 'Hybrid', 'Any']),
    linkedInProfile: z.string().optional(),
    portfolioLink: z.string().optional(),
    yearsOfExperience: z.number().int().positive(),
    currentMostRecentJob: z.string(),
    highestQualification: z.enum([
      'none',
      'elementary',
      'high school',
      'college',
      'masters',
      'phd',
    ]),
    majorFieldOfStudy: z.string().min(2).max(255),
    institution: z.string().min(2).max(255),
    graduationYear: z.number().int().positive(),
    keySkills: z.string().min(2).max(255),
    softwareProficiency: z.string().min(2).max(255),
    certifications: z.string().optional(),
    coverLetter: z.string().optional(),
    salaryExpectation: z.number().int().positive(),
    availability: z.string().min(2).max(255),
    jobAppliedFor: z.string().min(2).max(255),
    whyInterestedInRole: z.string().min(2).max(255),
    // tags: z.array(z.string()).min(1, { message: 'At least one tag is required' }),
    // file: z
    //   .any()
    //   // its a bird, its a plane, its a superRefine!
    //   // Can't help but think of the Superfriends when I see this
    //   .superRefine((file, ctx) => {
    //     // if editing, file is optional
    //     if (isEdit) return
    //     if (!file[0]) {
    //       ctx.addIssue({
    //         code: z.ZodIssueCode.custom,
    //         message: 'File is required',
    //       })
    //     }

    //     if (file[0]) {
    //       if (file[0].type !== 'application/pdf') {
    //         ctx.addIssue({
    //           code: z.ZodIssueCode.custom,
    //           message: 'File must be a PDF',
    //         })
    //       }
    //       if (file[0].size >= 5000000) {
    //         ctx.addIssue({
    //           code: z.ZodIssueCode.custom,
    //           message: 'File must be less than 5MB',
    //         })
    //       }
    //     }
    //   }),
  })

  const {
    register,
    handleSubmit,
    reset: formReset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applicantSchema),
    // resolver: async (data, context, options) => {
    //   const result = await zodResolver(applicantSchema)(data, context, options)
    //   console.log('Validation result:', result)
    //   return result
    // },
  })

  const handlePreview = (data) => {
    // console.log('data', data)
    try {
      const x = {
        ...data,
        // file: data.file[0],
        tags: selectedTags.map((tag) => tag._id),
      }
      setIsFormModalVisible(false)
      setIsPreview(true)
      setApplicantData(x)
    } catch (error) {
      addToast('Error', 'An error occurred', 'danger')
    }
  }

  const handlePreviewClose = () => {
    setIsPreview(false)
    setIsFormChecked(false)
    setSelectedTags([])
  }

  const handleFillMockData = () => {
    formReset({
      id: '',
      firstname: 'John',
      lastname: 'Doe',
      middlename: 'Ville',
      suffix: 'Jr.',
      email: 'johndoe@mail.com',
      phone: '09493260755',
      address: 'Quezon City, Philippines',
      prefferedWorkLocation: 'Remote',
      linkedInProfile: 'https://www.linkedin.com/in/johndoe',
      portfolioLink: 'https://www.github.com/johndoe',
      yearsOfExperience: 5,
      currentMostRecentJob: 'Software Developer',
      highestQualification: 'college',
      majorFieldOfStudy: 'Computer Science',
      institution: 'University of Lagos',
      graduationYear: 2021,
      keySkills: 'React, NodeJS, MongoDB',
      softwareProficiency: 'MS Office, Adobe Suite',
      certifications: 'Certification 1, Certification 2',
      coverLetter:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Nullam nec purus nec nunc tincidunt ultricies. Nullam nec purus nec nunc tincidunt ultricies.',
      salaryExpectation: 50000,
      availability: 'Immediate',
      jobAppliedFor: 'Software Developer',
      whyInterestedInRole:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Nullam nec purus nec nunc tincidunt ultricies. Nullam nec purus nec nunc tincidunt ultricies',

      // tags: [],
      // file: [],
    })
  }

  const handleUpload = async () => {
    try {
      const formData = new FormData()
      formData.append('firstname', applicantData.firstname)
      formData.append('lastname', applicantData.lastname)
      formData.append('middlename', applicantData.middlename)
      formData.append('suffix', applicantData.suffix)
      formData.append('email', applicantData.email)
      formData.append('phone', applicantData.phone)
      formData.append('address', applicantData.address)
      formData.append('prefferedWorkLocation', applicantData.prefferedWorkLocation)
      formData.append('linkedInProfile', applicantData.linkedInProfile)
      formData.append('portfolioLink', applicantData.portfolioLink)
      formData.append('yearsOfExperience', applicantData.yearsOfExperience)
      formData.append('currentMostRecentJob', applicantData.currentMostRecentJob)
      formData.append('highestQualification', applicantData.highestQualification)
      formData.append('majorFieldOfStudy', applicantData.majorFieldOfStudy)
      formData.append('institution', applicantData.institution)
      formData.append('graduationYear', applicantData.graduationYear)
      formData.append('keySkills', applicantData.keySkills)
      formData.append('softwareProficiency', applicantData.softwareProficiency)
      formData.append('certifications', applicantData.certifications)
      formData.append('coverLetter', applicantData.coverLetter)
      formData.append('salaryExpectation', applicantData.salaryExpectation)
      formData.append('availability', applicantData.availability)
      formData.append('jobAppliedFor', applicantData.jobAppliedFor)
      formData.append('whyInterestedInRole', applicantData.whyInterestedInRole)
      formData.append('tags', applicantData.tags) // Ensure tags are strings

      // Append the file
      // formData.append('file', applicantData.file)

      console.log('formData', formData)
      const res = isEdit
        ? await put(`/applicant/${applicantData.id}`, formData)
        : await post(`/applicant`, formData)

      if (res.status === 200 || res.status === 201) {
        addToast('Success', res.data.message, 'success')
        getAllData()
        handleReset()
        handlePreviewClose()
      } else {
        addToast('Error', res.message.message, 'danger')
        console.log(res)
      }
    } catch (error) {
      addToast('Error', 'an error occured', 'danger')
    }
  }

  const getAllData = async (page, limit) => {
    try {
      setIsLoading(true)
      const res = isSearchMode
        ? await get(`/applicant/search?query=${searchInput}&page=${page}&limit=${limit}&tags=`)
        : await get(`/applicant/all?page=${currentPage}&limit=${itemsPerPage}`)
      if (res.status === 200 || res.status === 201) {
        setApplicants(res.data.data)
        setCurrentPage(res.data.currentPage)
        setTotalPages(res.data.totalPages)
        setTotalItems(res.data.totalItems || 0)
        setIsLoading(false)
      } else {
        addToast('Applicants', res.message.message, 'danger')
        setIsLoading(false)
        setSearchMode(false)
      }
    } catch (error) {
      addToast('Error', 'An error occurred', 'danger')
      setIsLoading(false)
    }
  }

  const handleDownload = async (id) => {
    try {
      const res = await getFile(`/applicant/download/${id}`)
      if (res.status === 200) {
        // parse the file to a blob
        const blob = new Blob([res.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        setPdfFile(url)
      } else {
        addToast('Error', 'Error Downloading Resume File', 'danger')
      }
    } catch (error) {
      addToast('Error', 'An error occurred', 'danger')
    }
  }

  const handleEdit = async (id) => {
    try {
      handleReset()
      const res = await get(`/applicant/${id}`)
      if (res.status === 200) {
        formReset({
          id: res.data.data._id,
          firstname: res.data.data.firstname,
          lastname: res.data.data.lastname,
          middlename: res.data.data.middlename,
          suffix: res.data.data.suffix,
          email: res.data.data.email,
          phone: res.data.data.phone,
          address: res.data.data.address,
          prefferedWorkLocation: res.data.data.prefferedWorkLocation,
          linkedInProfile: res.data.data.linkedInProfile,
          portfolioLink: res.data.data.portfolioLink,
          yearsOfExperience: res.data.data.yearsOfExperience,
          currentMostRecentJob: res.data.data.currentMostRecentJob,
          highestQualification: res.data.data.highestQualification,
          majorFieldOfStudy: res.data.data.majorFieldOfStudy,
          institution: res.data.data.institution,
          graduationYear: res.data.data.graduationYear,
          keySkills: res.data.data.keySkills,
          softwareProficiency: res.data.data.softwareProficiency,
          certifications: res.data.data.certifications,
          coverLetter: res.data.data.coverLetter,
          salaryExpectation: res.data.data.salaryExpectation,
          availability: res.data.data.availability,
          jobAppliedFor: res.data.data.jobAppliedFor,
          whyInterestedInRole: res.data.data.whyInterestedInRole,

          tags: res.data.data.tags,
          file: [],
        })

        // handleDownload(res.data.data._id)
        // fetch tags data
        res.data.data.tags.map(async (tag) => {
          const res = await get(`/tags/${tag}`)
          if (res.status === 200) {
            setSelectedTags((prev) => [...prev, res.data.data])
          }
        })
        setIsEdit(true)
        setIsFormModalVisible(true)
        addToast(
          'Success',
          `You are now editing ${res.data.data.firstname} ${res.data.data.lastname}`,
          'success',
        )
      } else {
        addToast('Error', 'An error occurred', 'danger')
      }
    } catch (error) {
      addToast('Error', 'An error occurred', 'danger')
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

  const handleReset = () => {
    formReset({
      firstname: '',
      lastname: '',
      middlename: '',
      suffix: '',
      email: '',
      phone: '',
      address: '',
      prefferedWorkLocation: 'Remote',
      linkedInProfile: '',
      portfolioLink: '',
      yearsOfExperience: 2,
      currentMostRecentJob: '',
      highestQualification: '',
      majorFieldOfStudy: '',
      institution: '',
      graduationYear: 1990,
      keySkills: '',
      softwareProficiency: '',
      certifications: '',
      coverLetter: '',
      salaryExpectation: 10000,
      availability: '',
      jobAppliedFor: '',
      whyInterestedInRole: '',

      // tags: [],
      file: [],
    })
    setIsFormModalVisible(false)
  }

  // Forms Manipulation Functions+
  const tagSchema = z.object({
    name: z
      .string()
      .min(2, { message: 'Tag must be at least 2 characters long' })
      .max(255, { message: 'Tag must be at most 255 characters long' }),
    // category: z.string()
    //   .min(2, { message: "Category must be at least 2 characters long" })
    //   .max(255, { message: "Category must be at most 255 characters long" })
  })

  const {
    register: tagRegister,
    handleSubmit: tagHandleSubmit,
    formState: { errors: tagErrors },
  } = useForm({
    resolver: zodResolver(tagSchema),
  })

  const getAllTagOptions = async () => {
    try {
      setTagLoading(true)
      const category = 'applicant'
      const res = await get(`/tags/category/${category}`)
      if (res.status === 200) {
        setFormTags(res.data.data)
        setTagLoading(false)
      } else {
        addToast('Error', 'An error occurred', 'danger')
        setTagLoading(false)
      }
    } catch (error) {
      addToast('Error', 'An error occurred', 'danger')
    }
  }

  const handleTagChange = (tagID) => {
    const tag = formTags.find((tag) => tag._id === tagID)
    if (selectedTags.some((item) => item._id === tag._id)) {
      setSelectedTags((prev) => prev.filter((item) => item._id !== tag._id))
    } else {
      setSelectedTags((prev) => [...prev, tag])
    }
  }

  const handleAddTag = async (data) => {
    try {
      const tag = {
        name: data.name,
        category: 'applicant',
      }
      const res = await post('/tags', tag)
      if (res.status === 200 || res.status === 201) {
        addToast('Success', res.data.message, 'success')
        getAllTagOptions()
        setTagModalVisible(false)
      } else {
        addToast('Error', 'An error occurred', 'danger')
      }
    } catch (error) {
      addToast('Error', 'An error occurred', 'danger')
      console.log(error)
    }
  }

  // Search
  const searchSchema = z.object({
    searchInput: z.string().min(1, { message: 'Search query is required' }),
  })
  const {
    register: searchRegister,
    handleSubmit: searchHandleSubmit,
    formState: { errors: searchErrors },
  } = useForm({
    resolver: zodResolver(searchSchema),
  })

  const searchSubmit = async (data) => {
    try {
      setSearchMode(true)
      setSearchInput(data.searchInput)
      getAllData()
    } catch (error) {
      addToast('Error', 'An error occurred', 'danger')
    }
  }

  const resetAllData = async () => {
    setSearchMode(false)
    setSearchInput('')
    getAllData()
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  // const handleApplicantScreening = async (id) => {
  //   try {
  //     setScreeningModalVisible(true)
  //     setSelectedApplicantID(id)
  //   } catch (error) {
  //     addToast('Error', 'An error occurred', 'danger')
  //   }
  // }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getAllData()
      getAllTagOptions()
    }, 500)
    return () => {
      clearTimeout(delayDebounceFn)
    }
  }, [currentPage, totalPages, totalItems, searchInput, isSearchMode])

  return (
    <CContainer className="d-flex flex-column gap-2 mb-3">
      <CRow>
        <CCol>
          <h2>Screening </h2>
          <small>
            In this page, you can view, edit, delete, and you can view applicant resume&apos;s for
            screening then <span className="text-info">shorlist</span> them. You can also create new
            applicants <s>and download their resumes</s>.
          </small>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <div className="d-flex justify-content-end">
            <CButton
              className="btn btn-primary"
              onClick={() => {
                setIsFormModalVisible(!isFormModalVisible)
                setIsEdit(false)
                setSelectedTags([])
                setPdfFile(null)
              }}
            >
              Create
            </CButton>
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CModal
            visible={isFormModalVisible}
            size="lg"
            onClose={() => {
              setIsFormModalVisible(false)
              handleReset()
            }}
          >
            <CModalHeader>
              <CModalTitle>
                Resume Form{' '}
                <span className={isEdit ? 'text-danger' : 'text-success'}>
                  <small>{isEdit ? 'Edit Mode' : 'Create Mode'}</small>
                </span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm onSubmit={handleSubmit(handlePreview)}>
                <CContainer>
                  <CRow>
                    <CCol>
                      <h2>Personal Information</h2>
                    </CCol>
                    {config.env === 'development' && (
                      <CCol>
                        <CButton
                          className="btn btn-primary"
                          onClick={() => {
                            handleFillMockData()
                          }}
                        >
                          Fill Mock Data
                        </CButton>
                      </CCol>
                    )}
                  </CRow>
                  <CRow>
                    <CCol className="visually-hidden">
                      <CFormInput
                        type="text"
                        id="id"
                        placeholder="..."
                        label="ID"
                        {...register('id')}
                        invalid={!!errors.id}
                      />
                      {errors.id && (
                        <CFormFeedback className="text-danger">{errors.id.message}</CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol md={6}>
                      <CFormInput
                        type="text"
                        id="firstname"
                        placeholder="John Sr."
                        label="First Name"
                        {...register('firstname')}
                        invalid={!!errors.firstname}
                      />
                      {errors.firstname && (
                        <CFormFeedback className="text-danger">
                          {errors.firstname.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        type="text"
                        id="lastname"
                        placeholder="Doe"
                        label="Last Name"
                        {...register('lastname')}
                        invalid={!!errors.lastname}
                      />
                      {errors.lastname && (
                        <CFormFeedback className="text-danger">
                          {errors.lastname.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol md={6}>
                      <CFormInput
                        type="text"
                        id="middlename"
                        placeholder="John Sr."
                        label="Middle Name"
                        {...register('middlename')}
                        invalid={!!errors.middlename}
                      />
                      {errors.middlename && (
                        <CFormFeedback className="text-danger">
                          {errors.middlename.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                    <CCol md={6}>
                      <CFormInput
                        type="text"
                        id="suffix"
                        placeholder="Jr."
                        label="Suffix"
                        {...register('suffix')}
                        invalid={!!errors.suffix}
                      />
                      {errors.suffix && (
                        <CFormFeedback className="text-danger">
                          {errors.suffix.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <CFormInput
                        type="email"
                        id="email"
                        placeholder="user@mail.com"
                        label="Email"
                        {...register('email')}
                        invalid={!!errors.email}
                      />
                      {errors.email && (
                        <CFormFeedback className="text-danger">
                          {errors.email.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <CFormInput
                        type="text"
                        id="phone"
                        placeholder="1234567890"
                        label="Phone"
                        {...register('phone')}
                        invalid={!!errors.phone}
                      />
                      {errors.phone && (
                        <CFormFeedback className="text-danger">
                          {errors.phone.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <CFormTextarea
                        id="address"
                        placeholder="City, Country"
                        label="Address"
                        {...register('address')}
                        invalid={!!errors.address}
                        className="scalableCFormTextArea-200"
                      />
                      {errors.address && (
                        <CFormFeedback className="text-danger">
                          {errors.address.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <CFormSelect
                        id="prefferedWorkLocation"
                        label="Preffered Work Location"
                        {...register('prefferedWorkLocation')}
                        invalid={!!errors.prefferedWorkLocation}
                        options={[
                          { value: 'Remote', label: 'Remote' },
                          { value: 'Onsite', label: 'Onsite' },
                          { value: 'Hybrid', label: 'Hybrid' },
                          { value: 'Any', label: 'Any' },
                        ]}
                      />
                      {errors.prefferedWorkLocation && (
                        <CFormFeedback className="text-danger">
                          {errors.prefferedWorkLocation.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <CFormInput
                        type="text"
                        id="linkedInProfile"
                        placeholder="https://www.linkedin.com/in/example"
                        label="LinkedIn Profile"
                        {...register('linkedInProfile')}
                        invalid={!!errors.linkedInProfile}
                      />
                      {errors.linkedInProfile && (
                        <CFormFeedback className="text-danger">
                          {errors.linkedInProfile.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <CFormInput
                        type="text"
                        id="portfolioLink"
                        placeholder="https://www.github.com/example"
                        label="Porfolio (URL)"
                        {...register('portfolioLink')}
                        invalid={!!errors.portfolioLink}
                      />
                      {errors.portfolioLink && (
                        <CFormFeedback className="text-danger">
                          {errors.portfolioLink.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <hr />
                      <h2>Professional Background</h2>
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <CFormInput
                        type="number"
                        id="yearsOfExperience"
                        placeholder="0"
                        label="Years of Experience"
                        {...register('yearsOfExperience', { valueAsNumber: true })}
                        invalid={!!errors.yearsOfExperience}
                      />
                      {errors.yearsOfExperience && (
                        <CFormFeedback className="text-danger">
                          {errors.yearsOfExperience.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <CFormInput
                        type="text"
                        id="currentMostRecentJob"
                        placeholder="Software Developer"
                        label="Current/Most Recent Job"
                        {...register('currentMostRecentJob')}
                        invalid={!!errors.currentMostRecentJob}
                      />
                      {errors.currentMostRecentJob && (
                        <CFormFeedback className="text-danger">
                          {errors.currentMostRecentJob.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <hr />
                      <h2>Educational Background</h2>
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      {/* <CFormInput
                        type="text"
                        id="highestQualification"
                        placeholder="College Degree"
                        label="Highest Qualification"
                        {...register('currentMostRecentJob')}
                        invalid={!!errors.highestQualification}
                      />
                      {errors.highestQualification && (
                        <CFormFeedback className="text-danger">
                          {errors.highestQualification.message}
                        </CFormFeedback>
                      )} */}
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
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <CFormInput
                        type="text"
                        id="majorFieldOfStudy"
                        placeholder="Computer Science"
                        label="Major Field of Study"
                        {...register('majorFieldOfStudy')}
                        invalid={!!errors.majorFieldOfStudy}
                      />
                      {errors.majorFieldOfStudy && (
                        <CFormFeedback className="text-danger">
                          {errors.majorFieldOfStudy.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <CFormInput
                        type="text"
                        id="institution"
                        placeholder="University of Lagos"
                        label="Institution"
                        {...register('institution')}
                        invalid={!!errors.institution}
                      />
                      {errors.institution && (
                        <CFormFeedback className="text-danger">
                          {errors.institution.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <CFormInput
                        type="number"
                        id="graduationYear"
                        placeholder="2021"
                        label="Graduation Year"
                        {...register('graduationYear', { valueAsNumber: true })}
                        invalid={!!errors.graduationYear}
                      />
                      {errors.graduationYear && (
                        <CFormFeedback className="text-danger">
                          {errors.graduationYear.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <hr />
                      <h2>Skills and Qualification</h2>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CFormTextarea
                        id="keySkills"
                        placeholder="React, NodeJS, MongoDB"
                        label="Key Skills"
                        {...register('keySkills')}
                        invalid={!!errors.keySkills}
                        className="scalableCFormTextArea-200"
                      />
                      {errors.keySkills && (
                        <CFormFeedback className="text-danger">
                          {errors.keySkills.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <CFormTextarea
                        id="softwareProficiency"
                        placeholder="MS Office, Adobe Suite"
                        label="Software Proficiency"
                        {...register('softwareProficiency')}
                        invalid={!!errors.softwareProficiency}
                        className="scalableCFormTextArea-200"
                      />
                      {errors.softwareProficiency && (
                        <CFormFeedback className="text-danger">
                          {errors.softwareProficiency.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <CFormTextarea
                        id="certifications"
                        placeholder="Certification 1, Certification 2"
                        label="Certifications"
                        {...register('certifications')}
                        invalid={!!errors.certifications}
                        className="scalableCFormTextArea-200"
                      />
                      {errors.certifications && (
                        <CFormFeedback className="text-danger">
                          {errors.certifications.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>

                  <CRow className="mt-3">
                    <CCol>
                      <hr />
                      <h2>Job Specific Questions</h2>
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <CFormTextarea
                        id="coverLetter"
                        placeholder="Cover Letter"
                        label="Cover Letter"
                        {...register('coverLetter')}
                        invalid={!!errors.coverLetter}
                        className="scalableCFormTextArea-200"
                      />
                      {errors.coverLetter && (
                        <CFormFeedback className="text-danger">
                          {errors.coverLetter.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <CFormInput
                        type="number"
                        id="salaryExpectation"
                        placeholder="50000"
                        label="Salary Expectation Per Month"
                        {...register('salaryExpectation', { valueAsNumber: true })}
                        invalid={!!errors.salaryExpectation}
                      />
                      {errors.salaryExpectation && (
                        <CFormFeedback className="text-danger">
                          {errors.salaryExpectation.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <CFormInput
                        type="text"
                        id="availability"
                        placeholder="Immediate"
                        label="Availability"
                        {...register('availability')}
                        invalid={!!errors.availability}
                      />
                      {errors.availability && (
                        <CFormFeedback className="text-danger">
                          {errors.availability.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <CFormInput
                        type="text"
                        id="jobAppliedFor"
                        placeholder="Software Developer"
                        label="Job Applied For"
                        {...register('jobAppliedFor')}
                        invalid={!!errors.jobAppliedFor}
                      />
                      {errors.jobAppliedFor && (
                        <CFormFeedback className="text-danger">
                          {errors.jobAppliedFor.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol>
                      <CFormTextarea
                        id="whyInterestedInRole"
                        placeholder="lorem ipsum..."
                        label="Why Interested in Role?"
                        {...register('whyInterestedInRole')}
                        invalid={!!errors.whyInterestedInRole}
                        className="scalableCFormTextArea-200"
                      />
                      {errors.whyInterestedInRole && (
                        <CFormFeedback className="text-danger">
                          {errors.whyInterestedInRole.message}
                        </CFormFeedback>
                      )}
                    </CCol>
                  </CRow>

                  <CRow className="mt-3">
                    <CCol>
                      <CFormLabel htmlFor="tag">Tags</CFormLabel>
                      <CRow>
                        {formTags.map((tag) => {
                          return (
                            <CCol key={tag._id} xs="auto">
                              <CInputGroup>
                                <CBadge
                                  onClick={() => handleTagChange(tag._id)}
                                  className={
                                    selectedTags.some((item) => item._id === tag._id)
                                      ? 'btn btn-primary'
                                      : 'btn btn-outline-primary'
                                  }
                                  style={{
                                    cursor: 'pointer',
                                  }}
                                >
                                  {tag.name}
                                </CBadge>
                              </CInputGroup>
                            </CCol>
                          )
                        })}
                        <CCol>
                          <CTooltip content="Add tag">
                            <CBadge
                              className="btn btn-success mx-2"
                              onClick={() => setTagModalVisible(true)}
                            >
                              <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                            </CBadge>
                          </CTooltip>
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                  {/* if file exists, preview file */}
                  {/* {pdfFile && (
                    <CRow className="mt-3">
                      <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                        <Page pageNumber={pageNumber} />
                      </Document>
                    </CRow>
                  )} */}
                  {/* <CRow className="mt-3">
                    <CCol>
                      <CFormInput
                        type="file"
                        id="file"
                        placeholder="Enter Title"
                        label="Resume"
                        {...register('file', { value: [] })}
                        invalid={!!errors.file}
                      />
                      {errors.file && (
                        <CFormFeedback className="text-danger">{errors.file.message}</CFormFeedback>
                      )}
                    </CCol>
                  </CRow> */}
                  <CRow className="mt-3">
                    <CCol className="d-flex justify-content-end mt-2">
                      <CButton type="submit" color="primary">
                        {isEdit ? 'Update' : 'Submit'}
                      </CButton>
                    </CCol>
                  </CRow>
                </CContainer>
              </CForm>
            </CModalBody>
          </CModal>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CForm
            onSubmit={searchHandleSubmit(searchSubmit)}
            className="d-flex flex-row gap-2 justify-content-end align-items-center"
          >
            <CInputGroup>
              <CFormInput
                type="text"
                id="searchInput"
                name="searchInput"
                placeholder="Search..."
                {...searchRegister('searchInput')}
                invalid={!!searchErrors.searchInput}
              />
              <CTooltip content="Search" placement="top">
                <CButton type="submit" className="btn btn-primary">
                  <FontAwesomeIcon icon={faSearch} />
                </CButton>
              </CTooltip>
              <CTooltip content="Reset" placement="top">
                <CButton onClick={() => resetAllData()} type="button" className="btn btn-primary">
                  <FontAwesomeIcon icon={faRefresh} />
                </CButton>
              </CTooltip>
              {/* <CTooltip content="Add" placement="top">
                <CButton
                  className="btn btn-primary"
                  onClick={() => setIsFormModalVisible(!isFormModalVisible)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </CButton>
              </CTooltip> */}
            </CInputGroup>
          </CForm>
        </CCol>
      </CRow>
      <CRow className="mt-2">
        <CContainer>
          <CCard>
            <CCardBody>
              <CTable align="middle" hover responsive striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>
                      <strong>#</strong>
                    </CTableHeaderCell>
                    <CTableHeaderCell>
                      <FontAwesomeIcon icon={faUser} />
                    </CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Phone</CTableHeaderCell>
                    <CTableHeaderCell>Tags</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {isLoading ? (
                    <CTableRow>
                      <CTableDataCell colSpan="5">
                        <div className="pt-3 text-center">
                          <CSpinner color="primary" variant="grow" />
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    applicants.map((item, index) => {
                      return (
                        <CTableRow key={index}>
                          <CTableDataCell>
                            <small>{item._id}</small>
                          </CTableDataCell>
                          <CTableDataCell>
                            {item.firstname}, {item.lastname} {item?.middlename}
                          </CTableDataCell>
                          <CTableDataCell>{item.email}</CTableDataCell>
                          <CTableDataCell>{item.phone}</CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex flex-wrap">
                              {item.tags.map((tag, index) => {
                                const tagName = formTags.find(
                                  (formTag) => formTag._id === tag,
                                )?.name
                                return (
                                  <CBadge
                                    key={index}
                                    shape="rounded-pill"
                                    color="primary"
                                    className="me-1 mb-1"
                                  >
                                    {tagName}
                                  </CBadge>
                                )
                              })}
                              {item.isShortlisted && (
                                <CBadge shape="rounded-pill" color="success" className="me-1 mb-1">
                                  Shortlisted
                                </CBadge>
                              )}
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex flex-row gap-2">
                              <CTooltip content="Screen Applicant" placement="top">
                                <CButton
                                  className="btn btn-outline-info"
                                  onClick={() => {
                                    setSelectedApplicant(item)
                                    setScreeningFormModalVisible(true)
                                  }}
                                >
                                  <FontAwesomeIcon icon={faBolt} />
                                </CButton>
                              </CTooltip>
                              <CButtonGroup>
                                <CTooltip content="Edit" placement="top">
                                  <CButton
                                    onClick={() => handleEdit(item._id)}
                                    className="btn btn-outline-primary"
                                  >
                                    <FontAwesomeIcon icon={faPencil} />
                                  </CButton>
                                </CTooltip>
                                <CTooltip content="Delete" placement="top">
                                  <CButton
                                    onClick={() => handleDelete(item._id)}
                                    className="btn btn-outline-danger"
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </CButton>
                                </CTooltip>
                              </CButtonGroup>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CContainer>
      </CRow>

      <CRow>
        <div className="d-flex flex-row gap-2 justify-content-center align-items-center">
          <AppPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </CRow>

      {/* Modals */}
      <CRow>
        {/* Preview */}
        <CModal
          scrollable={true}
          alignment="center"
          visible={isPreview}
          onClose={() => handlePreviewClose()}
          size="xl"
        >
          <CModalHeader>
            <CModalTitle>Preview {isEdit ? 'Update' : 'Submission'}</CModalTitle>
          </CModalHeader>
          {applicantData && (
            <CModalBody>
              <div className="h6 fw-bold">Please check the details before submitting.</div>
              <CContainer className="d-flex flex-column gap-3">
                <CRow>
                  <CCol>
                    <CFormInput
                      type="text"
                      id="firstname"
                      placeholder="John Sr."
                      label="First Name"
                      readOnly
                      value={applicantData.firstname}
                    />
                  </CCol>
                  <CCol>
                    <CFormInput
                      type="text"
                      id="lastname"
                      placeholder="Doe"
                      label="Last Name"
                      readOnly
                      value={applicantData.lastname}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormInput
                      type="email"
                      id="email"
                      placeholder=""
                      label="Email"
                      readOnly
                      value={applicantData.email}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormInput
                      type="text"
                      id="phone"
                      placeholder=""
                      label="Phone"
                      readOnly
                      value={applicantData.phone}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormTextarea
                      id="address"
                      placeholder=""
                      label="Address"
                      readOnly
                      value={applicantData.address}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormInput
                      type="text"
                      id="prefferedWorkLocation"
                      placeholder=""
                      label="Preffered Work Location"
                      readOnly
                      value={applicantData.prefferedWorkLocation}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormInput
                      type="text"
                      id="linkedInProfile"
                      placeholder=""
                      label="LinkedIn Profile"
                      readOnly
                      value={applicantData.linkedInProfile}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormInput
                      type="text"
                      id="portfolioLink"
                      placeholder=""
                      label="Portfolio URL"
                      readOnly
                      value={applicantData.portfolioLink}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormInput
                      type="number"
                      id="yearsOfExperience"
                      placeholder=""
                      label="Years of Experience"
                      readOnly
                      value={applicantData.yearsOfExperience}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormInput
                      type="text"
                      id="currentMostRecentJob"
                      placeholder=""
                      label="Current/Most Recent Job"
                      readOnly
                      value={applicantData.currentMostRecentJob}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormInput
                      type="text"
                      id="highestQualification"
                      placeholder=""
                      label="Highest Qualification"
                      readOnly
                      value={applicantData.highestQualification}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormInput
                      type="text"
                      id="majorFieldOfStudy"
                      placeholder=""
                      label="Major Field Of Study"
                      readOnly
                      value={applicantData.majorFieldOfStudy}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormInput
                      type="text"
                      id="institution"
                      placeholder=""
                      label="Institution"
                      readOnly
                      value={applicantData.institution}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormInput
                      type="number"
                      id="graduationYear"
                      placeholder=""
                      label="Graduation Year"
                      readOnly
                      value={applicantData.graduationYear}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormTextarea
                      id="keySkills"
                      placeholder=""
                      label="Key Skills"
                      readOnly
                      value={applicantData.keySkills}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormTextarea
                      id="softwareProficiency"
                      placeholder=""
                      label="Software Proficiency"
                      readOnly
                      value={applicantData.softwareProficiency}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormTextarea
                      id="certifications"
                      placeholder=""
                      label="Certifications"
                      readOnly
                      value={applicantData.certifications}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormTextarea
                      id="coverLetter"
                      placeholder=""
                      label="Cover Letter"
                      readOnly
                      value={applicantData.coverLetter}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormInput
                      type="number"
                      id="salaryExpectation"
                      placeholder=""
                      label="Salary Expectation"
                      readOnly
                      value={applicantData.salaryExpectation}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormInput
                      type="text"
                      id="availability"
                      placeholder=""
                      label="Availability"
                      readOnly
                      value={applicantData.availability}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormInput
                      type="text"
                      id="jobAppliedFor"
                      placeholder=""
                      label="Job Applied For"
                      readOnly
                      value={applicantData.jobAppliedFor}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormTextarea
                      id="whyInterestedInRole"
                      placeholder=""
                      label="Why Interested in Role?"
                      readOnly
                      value={applicantData.whyInterestedInRole}
                    />
                  </CCol>
                </CRow>

                <CRow>
                  <CCol>
                    <CFormLabel htmlFor="tag">Tags</CFormLabel>
                    <CRow className="d-flex flex-row gap-2 justify-content-start">
                      {selectedTags.map((tag, index) => {
                        // console.log(tag)
                        return (
                          <CCol key={tag._id}>
                            <CInputGroup>
                              <CButton
                                {...register(`tags[${index}]`)}
                                className="btn btn-primary text-uppercase"
                                style={{
                                  width: '100%',
                                }}
                              >
                                {tag.name}
                              </CButton>
                            </CInputGroup>
                          </CCol>
                        )
                      })}
                    </CRow>
                  </CCol>
                </CRow>
              </CContainer>
              <hr />
              {/* <Document file={applicantData.file || pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} />
              </Document> */}
            </CModalBody>
          )}
          <CModalFooter>
            <div>
              {/* checkbox */}
              <div className="form-check d-flex justify-content-end">
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  id="flexCheckDefault"
                  onChange={() => setIsFormChecked(!isFormChecked)}
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  I have checked the details and I am ready to{' '}
                  {isEdit ? (
                    <span className="text-info">update</span>
                  ) : (
                    <span className="text-success">create</span>
                  )}{' '}
                  the data.
                </label>
              </div>
            </div>
            <CButton color="primary" onClick={() => handleUpload()} disabled={!isFormChecked}>
              {isEdit ? 'Update' : 'Submit'}
            </CButton>
          </CModalFooter>
        </CModal>

        {/* add tags modal */}
        <CModal
          alignment="center"
          visible={isTagModalVisible}
          onClose={() => setTagModalVisible(false)}
          size="sm"
        >
          <CModalHeader>
            <CModalTitle>Add Applicant Tag</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={tagHandleSubmit(handleAddTag)} className="d-flex flex-column gap-2">
              <CFormInput
                type="text"
                id="name"
                placeholder="Enter tag"
                {...tagRegister('name')}
                invalid={!!tagErrors.name}
              />
              {tagErrors.name && (
                <CFormFeedback className="text-danger">{tagErrors.name.message}</CFormFeedback>
              )}
              {/* <CFormInput
                type='text'
                id='category'
                placeholder='Enter category'
                {...tagRegister('category')}
                invalid={!!tagErrors.category}
              />
              {
                tagErrors.category &&
                <CFormFeedback className='text-danger'>
                  {tagErrors.category.message}
                </CFormFeedback>
              } */}
              <CButton type="submit" className="btn btn-success">
                Add Tag
              </CButton>
            </CForm>
          </CModalBody>
        </CModal>
      </CRow>
      <CRow>
        <CCol>
          <DocumentForm
            isVisible={isScreeningFormModalVisible}
            onClose={() => {
              setScreeningFormModalVisible(false)
              setSelectedApplicantID('')
            }}
            applicantData={selectedApplicant}
            docCategory="screening"
          />
        </CCol>
      </CRow>
    </CContainer>
  )
}
export default Screening
