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
  CCardHeader,
  CCardBody,
  CForm,
  CFormTextarea,
  CFormLabel,
  CFormInput,
  CFormFeedback,
  CButtonGroup,
  CButton,
  CCollapse,
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
} from '@coreui/react'
import AppPagination from '../../components/AppPagination'
import { pdfjs, Document, Page } from 'react-pdf'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AppContext } from '../../context/appContext'
import {
  faChevronDown,
  faChevronUp,
  faMinus,
  faPlus,
  faTrash,
  faRefresh,
  faPencil,
  faSearch,
  faUser,
  faPrint,
} from '@fortawesome/free-solid-svg-icons'
import { firstLetterUppercase } from '../../utils'
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const Applicant = () => {
  const { addToast } = useContext(AppContext)
  const [stats, setStats] = useState({
    applications: [
      {
        name: 'Total',
        color: 'info',
        value: 0,
        data: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Active',
        color: 'success',
        value: 0,
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  })

  const [isFormModalVisible, setIsFormModalVisible] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  // Data states
  const [data, setData] = useState({})
  const [allData, setAllData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Search states
  const [searchInput, setSearchInput] = useState('')
  const [isSearchMode, setSearchMode] = useState(false)

  // Form Elements states
  const [isEdit, setIsEdit] = useState(false)
  const [isFormChecked, setIsFormChecked] = useState(false)

  // Tags
  const [formTags, setFormTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [isTagLoading, setTagLoading] = useState(false)
  const [isTagModalVisible, setTagModalVisible] = useState(false)

  // Certifications
  const [certifications, setCertifications] = useState([])
  const [isCertificationModalVisible, setCertificationModalVisible] = useState(false)

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

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
    middlename: z.string().max(255, { message: 'Middle name must be at most 255 characters long' }),
    email: z.string().email(),
    phone: z
      .string()
      .min(10)
      .max(20)
      .refine(
        (phone) => {
          return phone.match(/^[0-9]+$/) !== null
        },
        { message: 'Phone number must be numeric' },
      ),
    address: z.string().min(10).max(255),
    portfolioUrl: z.string().optional(),
    profSummary: z.string().min(10).max(255),
    skills: z.string().min(10).max(255),
    workExperience: z.string().min(10).max(255),
    education: z.string().min(10).max(255),
    // certifications: z.array(z.string()).optional(),
    tags: z.array(z.string()).min(1, { message: 'At least one tag is required' }),
    remarks: z.string().optional(),
    file: z
      .any()
      // its a bird, its a plane, its a superRefine!
      // Can't help but think of the Superfriends when I see this
      .superRefine((file, ctx) => {
        // if editing, file is optional
        if (isEdit) return
        if (!file[0]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'File is required',
          })
        }

        if (file[0]) {
          if (file[0].type !== 'application/pdf') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'File must be a PDF',
            })
          }
          if (file[0].size >= 5000000) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'File must be less than 5MB',
            })
          }
        }
      }),
  })

  const {
    register,
    handleSubmit,
    reset: formReset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applicantSchema),
  })

  const handlePreview = (data) => {
    try {
      const x = {
        ...data,
        file: data.file[0],
      }
      setIsFormModalVisible(false)
      setIsPreview(true)
      setData(x)
    } catch (error) {
      addToast('Error', 'An error occurred', 'danger')
    }
  }

  const handlePreviewClose = () => {
    setIsPreview(false)
    setIsFormChecked(false)
  }

  const handleUpload = async () => {
    try {
      const filteredCertifications =
        certifications.length === 0
          ? []
          : certifications.map((cert) => {
              return {
                name: cert.name,
                authority: cert.authority,
                year: cert.year,
              }
            })

      const formData = new FormData()
      formData.append('firstname', data.firstname)
      formData.append('lastname', data.lastname)
      formData.append('middlename', data.middlename)
      formData.append('email', data.email)
      formData.append('phone', data.phone)
      formData.append('address', data.address)
      formData.append('portfolioUrl', data.portfolioUrl)
      formData.append('professionalSummary', data.profSummary)
      formData.append('skills', data.skills)
      formData.append('workExperience', data.workExperience)
      formData.append('education', data.education)

      // Convert certifications and tags arrays to JSON before appending
      formData.append('certifications', JSON.stringify(filteredCertifications))
      formData.append('tags', JSON.stringify(selectedTags.map((tag) => tag._id)))

      // Append the file
      formData.append('file', data.file)
      const res = isEdit
        ? await put(`/applicant/${data.id}`, formData)
        : await post(`/applicant`, formData)

      if (res.status === 200 || res.status === 201) {
        addToast('Success', res.data.message, 'success')
        getAllData()
        handleReset()
        handlePreviewClose()
      } else {
        addToast('Error', 'An error occurred', 'danger')
      }
    } catch (error) {
      addToast('Error', 'An error occurred', 'danger')
    }
  }

  const getAllData = async (page, limit) => {
    try {
      setIsLoading(true)
      const res = isSearchMode
        ? await get(`/applicant/search?query=${searchInput}&page=${page}&limit=${limit}&tags=`)
        : await get(`/applicant/all?page=${currentPage}&limit=${itemsPerPage}`)
      if (res.status === 200 || res.status === 201) {
        setAllData(res.data.data)
        setCurrentPage(res.data.currentPage)
        setTotalPages(res.data.totalPages)
        setTotalItems(res.data.totalItems || 0)
        setIsLoading(false)
      } else {
        addToast('Error', 'An error occurred', 'danger')
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
      setCertifications([])
      const res = await get(`/applicant/${id}`)
      if (res.status === 200) {
        formReset({
          id: res.data.data._id,
          firstname: res.data.data.firstname,
          lastname: res.data.data.lastname,
          middlename: res.data.data.middlename,
          email: res.data.data.email,
          phone: res.data.data.phone,
          address: res.data.data.address,
          portfolioUrl: res.data.data.portfolioUrl,
          profSummary: res.data.data.professionalSummary,
          skills: res.data.data.skills,
          workExperience: res.data.data.workExperience,
          education: res.data.data.education,
          certifications: res.data.data.certifications,
          tags: res.data.data.tags,
          file: [],
        })

        res.data.data.certifications.forEach((cert) => {
          setCertifications((prev) => [...prev, cert])
        })
        handleDownload(res.data.data._id)
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
      email: '',
      phone: '',
      address: '',
      portfolioUrl: '',
      profSummary: '',
      skills: '',
      workExperience: '',
      education: '',
      certifications: [],
      tags: [],
      file: [],
    })
    setPdfFile(null)
    setSelectedTags([])
    setCertifications([''])
    setIsEdit(false)
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

  const handleTagChange = async (e) => {
    try {
      const tag = formTags.find((tag) => tag._id === e)
      if (selectedTags.some((item) => item._id === tag._id)) {
        setSelectedTags((prev) => prev.filter((item) => item._id !== tag._id))
      } else {
        setSelectedTags((prev) => [...prev, tag])
      }
    } catch (error) {
      addToast('Error', 'An error occurred', 'danger')
    }
  }

  const handleAddTag = async (data) => {
    try {
      const tag = {
        name: data.name,
        category: 'applicant',
      }
      const res = await post('/tags', tag)
      if (res.status === 200) {
        addToast('Success', res.data.message, 'success')
        getAllTagOptions()
        setTagModalVisible(false)
      } else {
        addToast('Error', 'An error occurred', 'danger')
      }
    } catch (error) {
      addToast('Error', 'An error occurred', 'danger')
    }
  }

  // Certification Schema
  const certificationSchema = z.object({
    name: z
      .string()
      .min(2, { message: 'Certification must be at least 2 characters long' })
      .max(255, { message: 'Certification must be at most 255 characters long' }),
    authority: z
      .string()
      .min(2, { message: 'Authority must be at least 2 characters long' })
      .max(255, { message: 'Authority must be at most 255 characters long' }),
    year: z
      .string()
      .min(4, { message: 'Year must be at least 4 characters long' })
      .max(4, { message: 'Year must be at most 4 characters long' }),
  })

  const {
    register: certRegister,
    handleSubmit: certHandleSubmit,
    formState: { errors: certErrors },
  } = useForm({
    resolver: zodResolver(certificationSchema),
  })

  // Certification Fields Manipulation
  const handleAddCertField = (data) => {
    const newCert = {
      id: certifications.length + 1,
      name: data.name,
      authority: data.authority,
      year: data.year,
    }
    // remove the empty certification field
    setCertifications((prev) => [...prev, newCert])
  }

  const handleRemoveCertField = (name) => {
    if (certifications.length === 0) return
    setCertifications((prev) => prev.filter((cert) => cert.name !== name))
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
          <h2>Applicants </h2>
          <small>In this page, you can view, create, edit, delete and search for applicants.</small>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <div className="d-flex justify-content-end">
            <CButton
              className="btn btn-primary"
              onClick={() => setIsFormModalVisible(!isFormModalVisible)}
            >
              Create
            </CButton>
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          {/* <CCardHeader className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2 justify-content-between align-items-center">
                <strong>Resume Form</strong>
                <span
                  className={
                    isEdit
                      ? 'badge rounded-pill text text-danger'
                      : 'badge rounded-pill text text-success'
                  }
                >
                  {isEdit ? 'Edit Mode' : 'Create Mode'}
                </span>
              </div>
              <div className="d-flex justify-content-end gap-2">
                {isEdit && (
                  <CTooltip content="Reset" placement="top">
                    <CButton className="btn btn-danger" onClick={() => handleReset()}>
                      <FontAwesomeIcon icon={faRefresh}></FontAwesomeIcon>
                    </CButton>
                  </CTooltip>
                )}
                {isEdit && (
                  <CTooltip content="Print (unavailable)" placement="top">
                    <CButton
                      type="button"
                      // onClick={() => handlePrint()}
                      className="btn btn-info w-30"
                    >
                      <FontAwesomeIcon icon={faPrint} />
                    </CButton>
                  </CTooltip>
                )}
                <CTooltip content="Create" placement="top">
                  <CButton
                    className="btn btn-primary"
                    onClick={() => setIsFormModalVisible(!isFormModalVisible)}
                  >
                    Create
                  </CButton>
                </CTooltip>
              </div>
            </CCardHeader> */}
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
                    <div className="visually-hidden">
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
                    </div>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol md={5}>
                      <div>
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
                      </div>
                    </CCol>
                    <CCol md={5}>
                      <div>
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
                      </div>
                    </CCol>
                    <CCol md={2}>
                      <div>
                        <CFormInput
                          type="text"
                          id="middlename"
                          placeholder="..."
                          label="Middle Name"
                          {...register('middlename')}
                          invalid={!!errors.middlename}
                        />
                        {errors.middlename && (
                          <CFormFeedback className="text-danger">
                            {errors.middlename.message}
                          </CFormFeedback>
                        )}
                      </div>
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <div>
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
                    </div>
                  </CRow>
                  <CRow className="mt-3">
                    <div>
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
                    </div>
                  </CRow>
                  <CRow className="mt-3">
                    <div>
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
                    </div>
                  </CRow>
                  <CRow className="mt-3">
                    <div>
                      <CFormInput
                        type="text"
                        id="portfolioUrl"
                        placeholder="https://www.github.com/example"
                        label="Porfolio (URL)"
                        {...register('portfolioUrl')}
                        invalid={!!errors.portfolioUrl}
                      />
                      {errors.portfolioUrl && (
                        <CFormFeedback className="text-danger">
                          {errors.portfolioUrl.message}
                        </CFormFeedback>
                      )}
                    </div>
                  </CRow>
                  <CRow className="mt-3">
                    <div>
                      <CFormTextarea
                        type="text"
                        id="profSummary"
                        placeholder="..."
                        label="Professional Summary"
                        {...register('profSummary')}
                        invalid={!!errors.profSummary}
                      />
                      {errors.profSummary && (
                        <CFormFeedback className="text-danger">
                          {errors.profSummary.message}
                        </CFormFeedback>
                      )}
                    </div>
                  </CRow>
                  <CRow className="mt-3">
                    <div>
                      <CFormTextarea
                        type="text"
                        id="skills"
                        placeholder="..."
                        label="Skills"
                        {...register('skills')}
                        invalid={!!errors.skills}
                        className="scalableCFormTextArea-200"
                      />
                      {errors.skills && (
                        <CFormFeedback className="text-danger">
                          {errors.skills.message}
                        </CFormFeedback>
                      )}
                    </div>
                  </CRow>
                  <CRow className="mt-3">
                    <div>
                      <CFormTextarea
                        type="text"
                        id="workExperience"
                        placeholder={'Company Name\n' + 'Position\n' + 'Duration\n' + 'Description'}
                        label="Work Experience"
                        {...register('workExperience')}
                        invalid={!!errors.workExperience}
                        className="scalableCFormTextArea-200"
                      />
                      {errors.workExperience && (
                        <CFormFeedback className="text-danger">
                          {errors.workExperience.message}
                        </CFormFeedback>
                      )}
                    </div>
                  </CRow>
                  <CRow className="mt-3">
                    <div>
                      <CFormTextarea
                        type="text"
                        id="education"
                        placeholder={'School Name\n' + 'Degree\n' + 'Graduation Year\n'}
                        label="Education"
                        {...register('education')}
                        invalid={!!errors.education}
                        className="scalableCFormTextArea-200"
                      />
                      {errors.education && (
                        <CFormFeedback className="text-danger">
                          {errors.education.message}
                        </CFormFeedback>
                      )}
                    </div>
                  </CRow>
                  <CRow className="mt-3">
                    <div>
                      <CFormLabel htmlFor="certification">
                        {
                          <>
                            {'Certification '}
                            <span className="text-danger  text-muted">(Optional)</span>
                          </>
                        }
                      </CFormLabel>
                      {certifications.map((cert, index) => {
                        return (
                          <CRow key={index} className="d-flex flex-column gap-3 mb-3">
                            <CCol className="d-flex flex-column gap-2">
                              <div>
                                <CFormInput
                                  type="text"
                                  id={`name[${index}]`}
                                  placeholder="Certification Name"
                                  value={cert.name}
                                  readOnly
                                  {...certRegister(`certifications[${index}].name`)}
                                  invalid={
                                    !!certErrors.certifications &&
                                    !!certErrors.certifications[index]
                                  }
                                />
                                {certErrors.certifications && certErrors.certifications[index] && (
                                  <CFormFeedback className="text-danger">
                                    {certErrors.certifications[index].message}
                                  </CFormFeedback>
                                )}
                              </div>
                              <div>
                                <CFormInput
                                  type="text"
                                  id={`authority[${index}]`}
                                  placeholder="Certification Authority"
                                  value={cert.authority}
                                  readOnly
                                  {...certRegister(`certifications[${index}].authority`)}
                                  invalid={
                                    !!certErrors.certifications &&
                                    !!certErrors.certifications[index]
                                  }
                                />
                                {certErrors.certifications && certErrors.certifications[index] && (
                                  <CFormFeedback className="text-danger">
                                    {certErrors.certifications[index].message}
                                  </CFormFeedback>
                                )}
                              </div>
                              <div>
                                <CFormInput
                                  type="text"
                                  id={`year[${index}]`}
                                  placeholder="Certification Year"
                                  value={cert.year}
                                  readOnly
                                  {...certRegister(`certifications[${index}].year`)}
                                  invalid={
                                    !!certErrors.certifications &&
                                    !!certErrors.certifications[index]
                                  }
                                />
                                {certErrors.certifications && certErrors.certifications[index] && (
                                  <CFormFeedback className="text-danger">
                                    {certErrors.certifications[index].message}
                                  </CFormFeedback>
                                )}
                              </div>
                            </CCol>
                            <CCol className="d-flex justify-content-end">
                              <CTooltip content="Remove Field" placement="top">
                                <CButton
                                  onClick={() => handleRemoveCertField(cert.name)}
                                  className="btn btn-outline-danger"
                                >
                                  <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
                                </CButton>
                              </CTooltip>
                            </CCol>
                          </CRow>
                        )
                      })}
                      <div className="d-flex justify-content-end">
                        <CTooltip content="Add Certification" placement="top">
                          <CButton
                            className="btn btn-outline-success "
                            onClick={() => setCertificationModalVisible(true)}
                          >
                            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                          </CButton>
                        </CTooltip>
                      </div>
                    </div>
                  </CRow>
                  <CRow className="mt-3">
                    <div>
                      <CFormLabel htmlFor="tag">Tags</CFormLabel>
                      <CRow className="d-flex flex-row gap-2 justify-content-start">
                        {formTags.map((tag, index) => {
                          return (
                            <CCol key={tag._id}>
                              <CInputGroup>
                                <CButton
                                  onClick={() => handleTagChange(tag._id)}
                                  {...register(`tags[${index}]`)}
                                  className={
                                    selectedTags.some(
                                      (item) => item === tag._id || item._id === tag._id,
                                    )
                                      ? 'btn btn-primary'
                                      : 'btn btn-outline-primary'
                                  }
                                  style={{
                                    width: '100%',
                                  }}
                                >
                                  {firstLetterUppercase(tag.name)}
                                </CButton>
                              </CInputGroup>
                            </CCol>
                          )
                        })}
                        <CCol>
                          <CTooltip content="Add tag">
                            <CButton
                              className="btn btn-success mx-2"
                              onClick={() => setTagModalVisible(true)}
                            >
                              <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                            </CButton>
                          </CTooltip>
                        </CCol>
                      </CRow>

                      {errors.tags && (
                        <CFormFeedback className="text-danger">{errors.tags.message}</CFormFeedback>
                      )}
                    </div>
                  </CRow>
                  <CRow>
                    <div>
                      <CFormTextarea
                        id="remarks"
                        placeholder="..."
                        label="Remarks"
                        {...register('remarks')}
                        invalid={!!errors.remarks}
                        className="scalableCFormTextArea-200"
                      />
                      {errors.remarks && (
                        <CFormFeedback className="text-danger">
                          {errors.remarks.message}
                        </CFormFeedback>
                      )}
                    </div>
                  </CRow>
                  {/* if file exists, preview file */}
                  {pdfFile && (
                    <CRow className="mt-3">
                      <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                        <Page pageNumber={pageNumber} />
                      </Document>
                    </CRow>
                  )}
                  <CRow className="mt-3">
                    <div>
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
                    </div>
                  </CRow>
                  <CRow className="mt-3">
                    <div className="d-flex justify-content-end mt-2">
                      <CButton type="submit" color="primary">
                        {isEdit ? 'Update' : 'Submit'}
                      </CButton>
                    </div>
                  </CRow>
                </CContainer>
              </CForm>
            </CModalBody>
          </CModal>
        </CCol>
      </CRow>
      <CRow>
        <div>
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
        </div>
      </CRow>
      <CRow>
        <CContainer>
          <CCard>
            <CCardBody>
              <CTable align="middle" hover responsive striped>
                <CTableHead>
                  <CTableRow>
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
                    allData.map((item, index) => {
                      return (
                        <CTableRow key={index}>
                          <CTableDataCell>
                            {item.firstname}, {item.lastname} {item?.middlename}
                          </CTableDataCell>
                          <CTableDataCell>{item.email}</CTableDataCell>
                          <CTableDataCell>{item.phone}</CTableDataCell>
                          <CTableDataCell>
                            {item.tags.map((tag, index) => {
                              return (
                                <CBadge key={index} color="primary">
                                  {formTags.find((item) => item._id === tag) &&
                                    formTags.find((item) => item._id === tag).name}
                                </CBadge>
                              )
                            })}
                          </CTableDataCell>
                          <CTableDataCell>
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
          {data && (
            <CModalBody>
              <div className="h6 fw-bold">Please check the details before submitting.</div>
              <CContainer className="d-flex flex-column gap-3">
                <CRow>
                  <CCol md={5}>
                    <CFormInput
                      type="text"
                      id="firstname"
                      placeholder="John Sr."
                      label="First Name"
                      readOnly
                      value={data.firstname}
                    />
                  </CCol>
                  <CCol md={5}>
                    <CFormInput
                      type="text"
                      id="lastname"
                      placeholder="Doe"
                      label="Last Name"
                      readOnly
                      value={data.lastname}
                    />
                  </CCol>
                  <CCol md={2}>
                    <CFormInput
                      type="text"
                      id="middlename"
                      placeholder="..."
                      label="Middle Name"
                      readOnly
                      value={data.middlename}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormInput
                      type="email"
                      id="email"
                      placeholder="user@mail.com"
                      label="Email"
                      readOnly
                      value={data.email}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormInput
                      type="text"
                      id="phone"
                      placeholder="1234567890"
                      label="Phone"
                      readOnly
                      value={data.phone}
                      className="scalableCFormTextArea-200"
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormTextarea
                      id="address"
                      placeholder="City, Country"
                      label="Address"
                      readOnly
                      value={data.address}
                      className="scalableCFormTextArea-200"
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormInput
                      type="text"
                      id="portfolioUrl"
                      placeholder="https://www.github.com/example"
                      label="Porfolio (URL)"
                      readOnly
                      value={data.portfolioUrl}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormTextarea
                      type="text"
                      id="profSummary"
                      placeholder="..."
                      label="Professional Summary"
                      readOnly
                      value={data.profSummary}
                      className="scalableCFormTextArea-200"
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormTextarea
                      type="text"
                      id="skills"
                      placeholder="..."
                      label="Skills"
                      readOnly
                      value={data.skills}
                      className="scalableCFormTextArea-100"
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormTextarea
                      type="text"
                      id="workExperience"
                      placeholder={'Company Name\n' + 'Position\n' + 'Duration\n' + 'Description'}
                      label="Work Experience"
                      readOnly
                      value={data.workExperience}
                      className="scalableCFormTextArea-200"
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormTextarea
                      type="text"
                      id="education"
                      placeholder={'School Name\n' + 'Degree\n' + 'Graduation Year\n'}
                      label="Education"
                      readOnly
                      value={data.education}
                      className="scalableCFormTextArea-200"
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormLabel htmlFor="certification">Certification</CFormLabel>
                    {certifications.map((cert, index) => {
                      return (
                        <div key={index} className="d-flex flex-column gap-2">
                          <div>
                            <CFormInput
                              type="text"
                              id={`name[${index}]`}
                              placeholder="Certification Name"
                              value={cert.name}
                              readOnly
                            />
                          </div>
                          <div>
                            <CFormInput
                              type="text"
                              id={`authority[${index}]`}
                              placeholder="Certification Authority"
                              value={cert.authority}
                              readOnly
                            />
                          </div>
                          <div>
                            <CFormInput
                              type="text"
                              id={`year[${index}]`}
                              placeholder="Year"
                              value={cert.year}
                              readOnly
                            />
                          </div>
                          <hr />
                        </div>
                      )
                    })}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormLabel htmlFor="tag">Tags</CFormLabel>
                    <CRow className="d-flex flex-row gap-2 justify-content-start">
                      {selectedTags.map((tag, index) => {
                        return (
                          <CCol key={tag._id}>
                            <CInputGroup>
                              <CButton
                                {...register(`tags[${index}]`)}
                                className="btn btn-primary"
                                style={{
                                  width: '100%',
                                }}
                              >
                                {firstLetterUppercase(tag.name)}
                              </CButton>
                            </CInputGroup>
                          </CCol>
                        )
                      })}
                    </CRow>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormTextarea
                      type="text"
                      id="remarks"
                      placeholder="..."
                      label="Remarks"
                      readOnly
                      {...register('remarks')}
                      invalid={!!errors.remarks}
                      className="scalableCFormTextArea-200"
                    />
                  </CCol>
                </CRow>
              </CContainer>
              <hr />
              <Document file={data.file || pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} />
              </Document>
            </CModalBody>
          )}
          <CModalFooter>
            <div>
              {/* checkbox */}
              <div className="form-check d-flex justify-content-end">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="flexCheckDefault"
                  onChange={() => setIsFormChecked(!isFormChecked)}
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  I have checked the details
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

        {/* add certifications modal */}
        <CModal
          alignment="center"
          visible={isCertificationModalVisible}
          onClose={() => setCertificationModalVisible(false)}
          size="sm"
        >
          <CModalHeader>
            <CModalTitle>Add Certifications</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm
              onSubmit={certHandleSubmit(handleAddCertField)}
              className="d-flex flex-column gap-2"
            >
              <CFormInput
                type="text"
                id="name"
                placeholder="Enter certification"
                {...certRegister('name')}
                invalid={!!certErrors.name}
              />
              {certErrors.name && (
                <CFormFeedback className="text-danger">{certErrors.name.message}</CFormFeedback>
              )}
              <CFormInput
                type="text"
                id="authority"
                placeholder="Enter authority"
                {...certRegister('authority')}
                invalid={!!certErrors.authority}
              />
              {certErrors.authority && (
                <CFormFeedback className="text-danger">
                  {certErrors.authority.message}
                </CFormFeedback>
              )}
              <CFormInput
                type="number"
                id="year"
                placeholder="Enter year"
                {...certRegister('year')}
                invalid={!!certErrors.year}
              />
              {certErrors.year && (
                <CFormFeedback className="text-danger">{certErrors.year.message}</CFormFeedback>
              )}
              <CButton type="submit" className="btn btn-success">
                Add Certification
              </CButton>
            </CForm>
          </CModalBody>
        </CModal>
      </CRow>
    </CContainer>
  )
}
export default Applicant
