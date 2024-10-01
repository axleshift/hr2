import React, { useState, useEffect } from 'react'
import { set, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { post, put, get, del } from '../../api/axios'

import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CWidgetStatsA,
  CForm,
  CFormText,
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
  CFormSelect,
  CInputGroup,
  CBadge,
} from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'

import { pdfjs, Document, Page } from 'react-pdf'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
  faMinus,
  faPlus,
  faTrash,
  faRefresh,
  faPencil,
} from '@fortawesome/free-solid-svg-icons'
import { firstLetterUppercase, formattedDateMMM } from '../../utils'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const Applicant = () => {
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

  const [isFormExpanded, setIsFormExpanded] = useState(true)
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
        if (isEdit) {
          return
        }
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

    // resolver: async (data, context, options) => {
    //   const result = await zodResolver(applicantSchema)(data, context, options);
    //   console.log("Validation result:", result);
    //   return result;
    // },
  })

  const handlePreview = (data) => {
    try {
      // console.log(data)
      const x = {
        ...data,
        file: data.file[0],
      }
      setIsFormExpanded(false)
      setIsPreview(true)
      setData(x)
    } catch (error) {
      console.log(error)
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

      // Log FormData for debugging
      formData.forEach((value, key) => {
        console.log(key, value)
      })

      const res = isEdit
        ? await put(`/applicant/${data.id}`, formData)
        : await post(`/applicant`, formData)

      console.log(res)
      if (res.success === true) {
        alert(res.message)
        getAllData()
        handleReset()
        setIsPreview(false)
      } else {
        console.log('Failed')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getAllData = async (page, limit) => {
    try {
      setIsLoading(true)
      const res = isSearchMode
        ? await get(`/applicant/search?query=${searchInput}&page=${page}&limit=${limit}`)
        : await get(`/applicant/all?page=${currentPage}&limit=${itemsPerPage}`)
      if (res.success === true) {
        setAllData(res.data)
        setCurrentPage(res.currentPage)
        setTotalPages(res.totalPages)
        setTotalItems(res.totalItems)
        setIsLoading(false)
      } else {
        console.log('Failed')
        setIsLoading(false)
        setSearchMode(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = async (id) => {
    try {
      handleReset()
      setCertifications([])
      // console.log("Handle Edit: ", id)
      const res = await get(`/applicant/${id}`)
      // console.log("Edit Data: ", res)
      if (res.success === true) {
        formReset({
          id: res.data._id,
          firstname: res.data.firstname,
          lastname: res.data.lastname,
          middlename: res.data.middlename,
          email: res.data.email,
          phone: res.data.phone,
          address: res.data.address,
          portfolioUrl: res.data.portfolioUrl,
          profSummary: res.data.professionalSummary,
          skills: res.data.skills,
          workExperience: res.data.workExperience,
          education: res.data.education,
          certifications: res.data.certifications,
          tags: res.data.tags,
          file: '',
        })
        res.data.certifications.forEach((cert) => {
          setCertifications((prev) => [...prev, cert])
        })
        // fetch tags data
        res.data.tags.map(async (tag) => {
          const res = await get(`/tags/${tag}`)
          // console.log("Tag: ", res)
          if (res.success === true) {
            setSelectedTags((prev) => [...prev, res.data])
          } else {
            console.log('Failed')
          }
        })
        setIsEdit(true)
        setIsFormExpanded(true)
      } else {
        alert('Failed')
        console.log('Failed')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (data) => {
    try {
      if (!confirm('Are you sure you want to delete this record?')) {
        return
      }
      const res = await del(`/applicant/${data}`)
      if (res.success === true) {
        alert('Success')
        console.log('Success')
        getAllData()
      } else {
        console.log('Failed')
      }
    } catch (error) {
      console.log(error)
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
      file: '',
    })
    setSelectedTags([])
    setCertifications([''])
    setIsEdit(false)
    setIsFormExpanded(false)
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
    // resolver: async (data, context, options) => {
    //   const result = await zodResolver(tagSchema)(data, context, options);
    //   console.log("Validation result:", result);
    //   return result;
    // },
  })

  const getAllTagOptions = async () => {
    try {
      setTagLoading(true)
      const category = 'applicant'
      const res = await get(`/tags/category/${category}`)
      if (res.success === true) {
        setFormTags(res.data)
        setTagLoading(false)
      } else {
        console.log('Failed')
        setTagLoading(false)
      }
    } catch (error) {
      console.log(error)
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
      console.log(error)
    }
  }

  const handleAddTag = async (data) => {
    try {
      console.log(data)
      const tag = {
        name: data.name,
        category: 'applicant',
      }
      const res = await post('/tags', tag)
      if (res.success === true) {
        alert(res.message)
        getAllTagOptions()
        setTagModalVisible(false)
      } else {
        console.log('Failed')
      }
    } catch (error) {
      console.log(error)
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
    // resolver: async (data, context, options) => {
    //   const result = await zodResolver(certificationSchema)(data, context, options);
    //   console.log("Validation result:", result);
    //   return result;
    // }
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
    if (certifications.length === 1) return

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
    // resolver: async (data, context, options) => {
    //   const result = await zodResolver(searchSchema)(data, context, options);
    //   console.log("Validation result:", result);
    //   return result;
    // },
  })

  const searchSubmit = async (data) => {
    try {
      setSearchMode(true)
      setSearchInput(data.searchInput)
      getAllData()
    } catch (error) {
      console.log(error)
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
    //
    const delayDebounceFn = setTimeout(() => {
      getAllData()
      getAllTagOptions()
    }, 500)
    return () => {
      clearTimeout(delayDebounceFn)
    }
  }, [currentPage, totalPages, totalItems, searchInput, isSearchMode])

  // Pagination handler
  const handlePageChange = (action) => {
    console.log('Action: ', action)

    switch (action) {
      case 'firstPage':
        setCurrentPage(1)
        break

      case 'prevPage':
        setCurrentPage((prevPage) => prevPage - 1)
        break

      case 'nextPage':
        setCurrentPage((prevPage) => prevPage + 1)
        break

      case 'lastPage':
        setCurrentPage(totalPages)
        break

      default:
        console.warn('Unknown action:', action)
    }
  }

  return (
    <CContainer className="d-flex flex-column gap-2 mb-3">
      <CRow className="d-flex justify-content-center ">
        {stats.applications.map((stat, index) => {
          return (
            <CCol key={index} sm={6} xl={4} xxl={3}>
              <CWidgetStatsA
                className="mb-4"
                color={stat.color}
                value={
                  <>
                    <div className="fs-2 ">{stat.value}</div>
                  </>
                }
                title={stat.name}
                chart={
                  <CChart
                    className="mt-3"
                    style={{ height: '70px' }}
                    type="line"
                    data={{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(255,255,255,.2)',
                          borderColor: 'rgba(255,255,255,.55)',
                          data: stat.data,
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          display: false,
                        },
                        y: {
                          display: false,
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 2,
                          tension: 0.4,
                        },
                        point: {
                          radius: 0,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            </CCol>
          )
        })}
      </CRow>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
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
                      <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                    </CButton>
                  </CTooltip>
                )}
                <CTooltip content="Expand" placement="top">
                  <CButton
                    className="btn btn-primary"
                    onClick={() => setIsFormExpanded(!isFormExpanded)}
                  >
                    <FontAwesomeIcon
                      icon={isFormExpanded ? faChevronUp : faChevronDown}
                    ></FontAwesomeIcon>
                  </CButton>
                </CTooltip>
              </div>
            </CCardHeader>
            <CCollapse visible={isFormExpanded}>
              <CCardBody>
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
                          placeholder={
                            'Company Name\n' + 'Position\n' + 'Duration\n' + 'Description'
                          }
                          label="Work Experience"
                          {...register('workExperience')}
                          invalid={!!errors.workExperience}
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
                                  {certErrors.certifications &&
                                    certErrors.certifications[index] && (
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
                                  {certErrors.certifications &&
                                    certErrors.certifications[index] && (
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
                                  {certErrors.certifications &&
                                    certErrors.certifications[index] && (
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
                          <CFormFeedback className="text-danger">
                            {errors.tags.message}
                          </CFormFeedback>
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
                        />
                        {errors.remarks && (
                          <CFormFeedback className="text-danger">
                            {errors.remarks.message}
                          </CFormFeedback>
                        )}
                      </div>
                    </CRow>
                    <CRow className="mt-3">
                      <div>
                        <CFormInput
                          type="file"
                          id="file"
                          placeholder="Enter Title"
                          label="Resume"
                          {...register('file')}
                          invalid={!!errors.file}
                        />
                        {errors.file && (
                          <CFormFeedback className="text-danger">
                            {errors.file.message}
                          </CFormFeedback>
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
              </CCardBody>
            </CCollapse>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <CForm
                onSubmit={searchHandleSubmit(searchSubmit)}
                className="d-flex flex-row gap-2 justify-content-end align-items-center"
              >
                <div>
                  <CFormInput
                    type="text"
                    id="searchInput"
                    name="searchInput"
                    placeholder="..."
                    {...searchRegister('searchInput')}
                    invalid={!!searchErrors.searchInput}
                  />
                  {searchErrors.searchInput && (
                    <CFormFeedback className="text-danger">
                      {searchErrors.searchInput.message}
                    </CFormFeedback>
                  )}
                </div>
                <CButton type="submit" className="btn btn-primary">
                  Search
                </CButton>
                <CButton onClick={() => resetAllData()} type="button" className="btn btn-primary">
                  <FontAwesomeIcon icon={faRefresh} />
                </CButton>
              </CForm>
            </CCardHeader>
            <CCardBody>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <div>
                  {/* <ul className='list-group'>
                        {
                          allData.length === 0 ? (
                            <p>
                              No Data
                            </p>
                          )
                            : (
                              allData.map((item, index) => {
                                return (
                                  <li key={index} className='list-group-item d-flex justify-content-between align-items-center'>
                                    <div>
                                      <div className='text-muted' style={{
                                        fontSize: '0.8rem'
                                      }}>
                                        {item._id}
                                      </div>
                                      <div>
                                        <strong>
                                          {item.firstName} {item.lastName}
                                        </strong>
                                      </div>
                                      <div>
                                        {item.email}
                                      </div>
                                      <div>
                                        {item.phone}
                                      </div>
                                      <div>
                                        {item.address}
                                      </div>
                                    </div>
                                    <div>
                                      <CButtonGroup>
                                        <CTooltip
                                          content='Edit'
                                          placement='top'
                                        >
                                          <CButton
                                            onClick={() => handleEdit(item._id)}
                                            className='btn btn-outline-primary'
                                          >
                                            <FontAwesomeIcon icon={faPencil} />
                                          </CButton>
                                        </CTooltip>
                                        <CTooltip
                                          content='Delete'
                                          placement='top'
                                        >
                                          <CButton
                                            onClick={() => handleDelete(item._id)}
                                            className='btn btn-outline-danger'
                                          >
                                            <FontAwesomeIcon icon={faTrash} />
                                          </CButton>
                                        </CTooltip>
                                      </CButtonGroup>
                                    </div>
                                  </li>
                                )
                              })
                            )
                        }
                      </ul> */}
                  {allData.length === 0 ? (
                    <p>No Data</p>
                  ) : (
                    allData.map((item, index) => {
                      return (
                        <CCard key={index}>
                          <CCardBody>
                            <div className="d-flex gap-2">
                              {/* expired? */}
                              {item.expired < new Date().toISOString() ? (
                                <CBadge color="danger">Expired</CBadge>
                              ) : (
                                <CBadge color="success">Active</CBadge>
                              )}
                              {item.tags.map((tag, index) => {
                                return (
                                  <CBadge key={index} color="primary">
                                    {/* // get tag name from formtags */}
                                    {formTags.find((item) => item._id === tag) &&
                                      formTags.find((item) => item._id === tag).name}
                                  </CBadge>
                                )
                              })}
                            </div>
                            <div>
                              <div
                                className="text-muted d-flex gap-2"
                                style={{
                                  fontSize: '0.8rem',
                                }}
                              >
                                {item._id}
                              </div>
                              <div>
                                <strong>
                                  {item.firstname}, {item.lastname} {item?.middlename}
                                </strong>
                              </div>
                            </div>

                            <div className="d-flex justify-content-end">
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
                          </CCardBody>
                        </CCard>
                      )
                    })
                  )}
                </div>
              )}
            </CCardBody>
            <CCardFooter className="d-flex flex-row gap-2 justify-content-center align-items-center">
              <CButton
                onClick={() => handlePageChange('firstPage')}
                disabled={currentPage === 1 && true}
                className="btn btn-outline-primary"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </CButton>

              <CButton
                onClick={() => handlePageChange('prevPage')}
                disabled={currentPage === 1 && true}
                className="btn btn-outline-primary"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </CButton>
              <p>
                Page {currentPage} of {totalPages}
              </p>

              <CButton
                onClick={() => handlePageChange('nextPage')}
                disabled={currentPage === totalPages && true}
                className="btn btn-outline-primary"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </CButton>
              <CButton
                onClick={() => handlePageChange('lastPage')}
                disabled={currentPage === totalPages && true}
                className="btn btn-outline-primary"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
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
                    />
                  </CCol>
                </CRow>
              </CContainer>
              <hr />
              {/* <div className='d-flex justify-content-end'>
                  <CButton type='button' onClick={() => setPdfScale(prev => prev + 0.1)}>
                    <FontAwesomeIcon icon={faPlus} />
                  </CButton>
                  <CButton type='button' onClick={() => setPdfScale(prev => prev - 0.1)}>
                    <FontAwesomeIcon icon={faMinus} />
                  </CButton>
                </div> */}
              <Document file={data.file} onLoadSuccess={onDocumentLoadSuccess}>
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
