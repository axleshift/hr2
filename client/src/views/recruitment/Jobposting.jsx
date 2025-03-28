import React, { useEffect, useState, useContext } from 'react'
import { AppContext } from '../../context/appContext'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { post, put, get } from '../../api/axios'

import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormCheck,
  CFormFeedback,
  CTooltip,
  CInputGroup,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMoneyBill,
  faRefresh,
  faPencil,
  faCalendar,
  faSearch,
  faPrint,
  faCheckCircle,
  faGlobe,
  faCoins,
} from '@fortawesome/free-solid-svg-icons'
import AppPagination from '../../components/AppPagination'
import { formatDate, formatCurency, trimString } from '../../utils'
const Jobposting = () => {
  const { addToast } = useContext(AppContext)

  const [isJobFormVisible, setIsJobFormVisible] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isStatus, setStatus] = useState('active')

  //
  const [allData, setAllData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Search
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalPages, setTotalPages] = useState(1)

  // Display mode
  const [displayMode, setDisplayMode] = useState('grid')

  const tommorrow = new Date(new Date().setDate(new Date().getDate() + 1))
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))

  const formSchema = z
    .object({
      jpf_id: z.string().optional(),
      jpfTitle: z.string().min(1, { message: 'Job Title is required' }),
      jpfType: z.string().min(1, { message: 'Job Type is required' }),
      jpfDesc: z.string().min(1, { message: 'Job Description is required' }),
      jpfSalaryMin: z.number().min(1, { message: 'Minimum Salary is required' }).default(0),
      jpfSalaryMax: z.number().min(1, { message: 'Maximum Salary is required' }).default(1),
      jpfLoc: z.string().min(1, { message: 'Location is required' }),
      jpfBnft: z.string().min(1, { message: 'Benefit is required' }),
      jpfReq: z.string().min(1, { message: 'Requirement is required' }),
      // jpfSchedStart: z.preprocess(
      //   (val) => new Date(val),
      //   z.date().min(yesterday, { message: 'Start Date must be today or later' }),
      // ),
      jpfSchedStart: z.preprocess((val) => new Date(val), z.date()),
      jpfSchedEnd: z.preprocess(
        (val) => new Date(val),
        z.date().min(new Date(), { message: 'End Date must be in the future' }),
      ),
      jpfStatus: z.string().optional(),
    })
    .refine(
      (data) => {
        // console.log('Start Date:', data.jpfSchedStart, 'End Date:', data.jpfSchedEnd)
        return data.jpfSchedEnd > data.jpfSchedStart
      },
      {
        message: 'End Date must be after Start Date',
        path: ['jpfSchedEnd'],
      },
    )
    .refine((data) => data.jpfSalaryMin < data.jpfSalaryMax, {
      message: 'Minimum Salary must be less than Maximum Salary',
      path: ['jpfSalaryMax'],
    })

  const {
    register: formRegister,
    reset: formReset,
    handleSubmit: formHandleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    // resolver: async (data, context, options) => {
    //   try {
    //     const result = await zodResolver(formSchema)(data, context, options)
    //     console.log('Validation result:', result)
    //     return result
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
  })

  // CREATE JOB POSTING
  const onSubmit = async (data) => {
    try {
      const formattedData = {
        title: data.jpfTitle || 'none',
        type: data.jpfType || 'none',
        salary_min: data.jpfSalaryMin || 0,
        salary_max: data.jpfSalaryMax || 1,
        location: data.jpfLoc || 'none',
        description: data.jpfDesc || 'none',
        requirements: data.jpfReq || 'none',
        responsibilities: data.jpfResp || 'none',
        benefits: data.jpfBnft || 'none',
        schedule_start: data.jpfSchedStart,
        schedule_end: data.jpfSchedEnd,
        status: data.jpfStatus || 'inactive',
      }
      // console.log('ID:', data.jpf_id)
      const res = isEdit
        ? await put(`/jobposting/${data.jpf_id}`, formattedData)
        : await post('/jobposting', formattedData)
      if (res.status === 201) {
        addToast('Jobposting', res.data.message, 'success')
        getAllJobPosting(1)
        formReset()
      }
    } catch (error) {
      console.log(error)
      addToast('Jobposting', 'Error creating jobposting', 'danger')
    }
  }

  // Handle Edit
  const handleEdit = async (id) => {
    try {
      const res = await get(`/jobposting/${id}`)
      if (res.status === 200) {
        addToast('Jobposting', `Jobposting for ${id} retrieved`, 'success')
        setIsEdit(true)
        setIsJobFormVisible(true)
        // console.log('Edit: ', res.data)
        const formattedData = {
          jpf_id: res.data.data._id,
          jpfTitle: res.data.data.title,
          jpfType: res.data.data.type,
          jpfDesc: res.data.data.description,
          jpfSalaryMin: res.data.data.salary_min,
          jpfSalaryMax: res.data.data.salary_max,
          jpfLoc: res.data.data.location,
          jpfBnft: res.data.data.benefits,
          jpfReq: res.data.data.requirements,
          // jpfResp: res.data.data.responsibilities,
          jpfSchedStart: new Date(res.data.data.schedule_start).toISOString().split('T')[0],
          jpfSchedEnd: new Date(res.data.data.schedule_end).toISOString().split('T')[0],
          jpfStatus: res.data.status,
        }
        formReset(formattedData)
        window.scrollTo(0, 0)
      } else {
        addToast('Jobposting', 'Error getting jobposting', 'danger')
      }
    } catch (error) {
      console.log(error)
      addToast('Jobposting', 'Error getting jobposting', 'danger')
    }
  }

  const handleEditReset = () => {
    setIsEdit(false)
    setIsJobFormVisible(false)
    const emptyFormData = {
      jpf_id: '',
      jpfTitle: '',
      jpfType: '',
      jpfDesc: '',
      jpfSalaryMin: 0,
      jpfSalaryMax: 1,
      jpfLoc: '',
      jpfBnft: '',
      jpfReq: '',
      jpfSchedStart: new Date().toISOString().split('T')[0],
      jpfSchedEnd: new Date().toISOString().split('T')[0],
      jpfStatus: 'active',
    }
    formReset(emptyFormData)
  }

  const handleCheck = (event) => {
    setIsChecked(event.target.checked)
  }

  // GET ALL JOB POSTING
  const getAllJobPosting = async (page, limit) => {
    try {
      setIsLoading(true)
      const res = isSearchMode
        ? await get(`/jobposting/search?query=${searchInput}&page=${page}&limit=${limit}`)
        : await get(`/jobposting?page=${page}&limit=${limit}`)

      if (res.status === 200 || res.status === 201) {
        setAllData(res.data.data)
        setCurrentPage(res.data.currentPage)
        setTotalPages(res.data.totalPages)
        setIsJobFormVisible(false)
        setIsLoading(false)
      } else {
        addToast('Jobposting' + ' ' + res.status, res.message.message, 'danger')
        setIsLoading(false)
        setIsSearchMode(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // SEARCH JOB POSTING
  const searchSchema = z.object({
    jpSearchInput: z.string().min(1, { message: 'Search query is required' }),
  })
  const { register: searchRegister, handleSubmit: searchHandleSubmit } = useForm({
    resolver: zodResolver(searchSchema),
    // resolver: async (data, context, options) => {
    //   const result = await zodResolver(searchSchema)(data, context, options)
    //   console.log('Validation result:', result)
    //   return result
    // },
  })
  const handleSearchSubmit = async (data) => {
    try {
      setIsSearchMode(true)
      setIsLoading(true)
      setSearchInput(data.jpSearchInput)
      getAllJobPosting(1, itemsPerPage)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      setIsSearchMode(false)
    }
  }

  const resetData = () => {
    setIsSearchMode(false)
    setSearchInput('')
    getAllJobPosting(1, itemsPerPage)
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getAllJobPosting(currentPage, itemsPerPage)
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [currentPage, itemsPerPage, isSearchMode, searchInput])

  return (
    <>
      <CContainer>
        <CRow className="mb-3">
          <CCol>
            <h1>Job Postings</h1>
            <small className="text-muted">
              In this page, you can view all the job posting data, create new job postings, and edit
              existing job postings.
            </small>
          </CCol>
        </CRow>
        <CRow>
          <CCol className="d-flex justify-content-end">
            <div>
              <CButton
                type="button"
                onClick={() => setIsJobFormVisible(!isJobFormVisible)}
                color="primary"
                size="sm"
              >
                Create
              </CButton>
            </div>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol>
            <CModal
              visible={isJobFormVisible}
              size="lg"
              backdrop="static"
              onClose={() => {
                setIsJobFormVisible(false)
                handleEditReset()
              }}
            >
              <CModalHeader>
                <CModalTitle>
                  <div>
                    {isEdit ? 'Edit Job Posting' : 'Create Job Posting'}
                    <span
                      className={
                        isStatus === 'active'
                          ? 'badge rounded-pill text text-success'
                          : 'badge rounded-pill text text-danger'
                      }
                    >
                      {isStatus === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CForm onSubmit={formHandleSubmit(onSubmit)}>
                  <CRow className="visually-hidden">
                    <div>
                      <CFormInput type="text" id="jpf_id" {...formRegister('jpf_id')} />
                    </div>
                  </CRow>
                  {/* Job Title Input */}
                  <CRow>
                    <div className="mb-3">
                      <CFormLabel htmlFor="jpfTitle">Job Title</CFormLabel>
                      <CFormInput
                        type="text"
                        id="jpfTitle"
                        placeholder="e.g. Software Engineer"
                        {...formRegister('jpfTitle')}
                        invalid={!!errors.jpfTitle}
                      />
                      {errors.jpfTitle && (
                        <CFormFeedback invalid>{errors.jpfTitle.message}</CFormFeedback>
                      )}
                    </div>
                  </CRow>

                  {/* Job Type Input */}
                  <CRow>
                    <div className="mb-3">
                      <CFormLabel htmlFor="jpfType">Job Type</CFormLabel>
                      <CFormInput
                        type="text"
                        id="jpfType"
                        placeholder="e.g. Full-time"
                        {...formRegister('jpfType')}
                        invalid={!!errors.jpfType}
                      />
                      {errors.jpfType && (
                        <CFormFeedback invalid>{errors.jpfType.message}</CFormFeedback>
                      )}
                    </div>
                  </CRow>

                  {/* Salary Inputs */}
                  <CRow>
                    <strong>Salary</strong>
                  </CRow>
                  <CRow>
                    <CCol>
                      <div className="mb-3">
                        <CFormLabel htmlFor="jpfSalaryMin">Minimum</CFormLabel>
                        <CFormInput
                          type="number"
                          id="jpfSalaryMin"
                          placeholder="0"
                          {...formRegister('jpfSalaryMin', {
                            valueAsNumber: true,
                          })}
                          invalid={!!errors.jpfSalaryMin}
                        />
                        {errors.jpfSalaryMin && (
                          <CFormFeedback invalid>{errors.jpfSalaryMin.message}</CFormFeedback>
                        )}
                      </div>
                    </CCol>
                    <CCol>
                      <div className="mb-3">
                        <CFormLabel htmlFor="jpfSalaryMax">Maximum</CFormLabel>
                        <CFormInput
                          type="number"
                          id="jpfSalaryMax"
                          placeholder="1"
                          {...formRegister('jpfSalaryMax', {
                            valueAsNumber: true,
                          })}
                          invalid={!!errors.jpfSalaryMax}
                        />
                        {errors.jpfSalaryMax && (
                          <CFormFeedback invalid>{errors.jpfSalaryMax.message}</CFormFeedback>
                        )}
                      </div>
                    </CCol>
                  </CRow>

                  {/* Location Input */}
                  <CRow>
                    <div className="mb-3">
                      <CFormLabel htmlFor="jpfLoc">Location</CFormLabel>
                      <CFormInput
                        type="text"
                        id="jpfLoc"
                        placeholder="e.g. Manila"
                        {...formRegister('jpfLoc')}
                        invalid={!!errors.jpfLoc}
                      />
                      {errors.jpfLoc && (
                        <CFormFeedback invalid>{errors.jpfLoc.message}</CFormFeedback>
                      )}
                    </div>
                  </CRow>

                  {/* Description Input */}
                  <CRow>
                    <div className="mb-3">
                      <CFormLabel htmlFor="jpfDesc">Description</CFormLabel>
                      <CFormTextarea
                        id="jpfDesc"
                        placeholder="e.g. Job description details..."
                        {...formRegister('jpfDesc')}
                        invalid={!!errors.jpfDesc}
                        className="scalableCFormTextArea-200"
                      />
                      {errors.jpfDesc && (
                        <CFormFeedback invalid>{errors.jpfDesc.message}</CFormFeedback>
                      )}
                    </div>
                  </CRow>

                  {/* Benefits Input */}
                  <CRow>
                    <div className="mb-3">
                      <CFormLabel htmlFor="jpfBnft">Benefits</CFormLabel>
                      <CFormTextarea
                        id="jpfBnft"
                        placeholder="e.g. Dental Care"
                        {...formRegister('jpfBnft')}
                        invalid={!!errors.jpfBnft}
                        className="scalableCFormTextArea-200"
                      />
                      {errors.jpfBnft && (
                        <CFormFeedback invalid>{errors.jpfBnft.message}</CFormFeedback>
                      )}
                    </div>
                  </CRow>

                  {/* Requirements Input */}
                  <CRow>
                    <div className="mb-3">
                      <CFormLabel htmlFor="jpfReq">Requirements</CFormLabel>
                      <CFormTextarea
                        id="jpfReq"
                        placeholder="e.g. Identification Documents"
                        {...formRegister('jpfReq')}
                        invalid={!!errors.jpfReq}
                        className="scalableCFormTextArea-200"
                      />
                      {errors.jpfReq && (
                        <CFormFeedback invalid>{errors.jpfReq.message}</CFormFeedback>
                      )}
                    </div>
                  </CRow>

                  {/* Deployment Schedule */}
                  <CRow>
                    <strong>Deployment Schedule</strong>
                    <p className="text-muted small">
                      These parameters determine the duration of the job posting.
                    </p>
                  </CRow>
                  <CRow>
                    <CCol>
                      <div className="mb-3">
                        <CFormLabel htmlFor="jpfSchedStart">Start</CFormLabel>
                        <CFormInput
                          type="date"
                          id="jpfSchedStart"
                          {...formRegister('jpfSchedStart')}
                          invalid={!!errors.jpfSchedStart}
                        />
                        {errors.jpfSchedStart && (
                          <CFormFeedback invalid>{errors.jpfSchedStart.message}</CFormFeedback>
                        )}
                      </div>
                    </CCol>
                    <CCol>
                      <div className="mb-3">
                        <CFormLabel htmlFor="jpfSchedEnd">Expire</CFormLabel>
                        <CFormInput
                          type="date"
                          id="jpfSchedEnd"
                          {...formRegister('jpfSchedEnd')}
                          invalid={!!errors.jpfSchedEnd}
                        />
                        {errors.jpfSchedEnd && (
                          <CFormFeedback invalid>{errors.jpfSchedEnd.message}</CFormFeedback>
                        )}
                      </div>
                    </CCol>
                  </CRow>
                  <hr />
                  {/* Confirmation Check */}
                  <CRow>
                    <div className="ml-5 mb-3 d-flex justify-content-end">
                      <CFormCheck
                        type="checkbox"
                        id="invalidCheck"
                        label="I've reviewed the job posting and checked that all is correct. "
                        checked={isChecked}
                        onChange={handleCheck}
                      />
                      <CFormFeedback invalid>You must agree before submitting.</CFormFeedback>
                    </div>
                  </CRow>

                  {/* Submit Button */}
                  <CRow>
                    <CCol className="d-flex flex-row gap-2 justify-content-end">
                      <div>
                        {isEdit && (
                          <CTooltip content="Print (unavailable)" placement="top">
                            <CButton
                              type="button"
                              // onClick={() => handleEditReset()}
                              color="info"
                              size="sm"
                            >
                              <FontAwesomeIcon icon={faPrint} />
                            </CButton>
                          </CTooltip>
                        )}
                      </div>
                      <div>
                        <CButton color="primary" size="sm" type="submit" disabled={!isChecked}>
                          {isLoading ? <CSpinner color="primary" /> : isEdit ? 'Update' : 'Add'}
                        </CButton>
                      </div>
                    </CCol>
                  </CRow>
                </CForm>
              </CModalBody>
            </CModal>
          </CCol>
        </CRow>
        <CRow className="d-flex mb-3 ustify-content-between align-items-center">
          <CContainer>
            <CForm
              onSubmit={searchHandleSubmit(handleSearchSubmit)}
              className="d-flex flex-row gap-2 justify-content-end align-items-center"
            >
              <CInputGroup>
                <CFormInput
                  type="text"
                  id="jpSearchInput"
                  placeholder="..."
                  {...searchRegister('jpSearchInput')}
                  invalid={!!errors.jpSearchInput}
                />

                <CTooltip content="Search" placement="top">
                  <CButton type="submit" color="primary" size="sm">
                    <FontAwesomeIcon icon={faSearch} />
                  </CButton>
                </CTooltip>
                <CTooltip content="Reset" placement="top">
                  <CButton onClick={() => resetData()} type="button" color="primary" size="sm">
                    <FontAwesomeIcon icon={faRefresh} />
                  </CButton>
                </CTooltip>
              </CInputGroup>
              {/* <CButton
                onClick={() => setDisplayMode(displayMode === 'grid' ? 'list' : 'grid')}
                className="btn btn-primary"
              >
                <FontAwesomeIcon icon={displayMode === 'grid' ? faGripHorizontal : faList} />
              </CButton> */}
            </CForm>
          </CContainer>
        </CRow>
        <CRow>
          {isLoading ? (
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          ) : (
            <div>
              {displayMode === 'grid' ? (
                <CRow xs={{ cols: 1 }} md={{ cols: 3 }} className="g-3">
                  {allData.map((data) => {
                    if (!data) {
                      return <div key={Math.random()}>Loading</div>
                    }
                    return (
                      <CCol key={data._id}>
                        <CCard className="position-relative h-100">
                          <CCardBody>
                            <h4 className="fw-bold text-capitalize">{data.title}</h4>
                            <div>
                              <FontAwesomeIcon icon={faGlobe} className="me-2" />
                              <small className="text-muted text-capitalize">{data.location}</small>
                            </div>
                            <div>
                              {/* <strong>Status</strong> */}
                              {/* <br /> */}
                              <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                              {data.status === 'active' ? (
                                <small className="text-success">Active</small>
                              ) : (
                                <small className="text-danger">Inactive</small>
                              )}
                            </div>
                            <div>
                              {/* <strong>Deployment</strong>
                              <br /> */}
                              <FontAwesomeIcon icon={faCalendar} className="me-2" />
                              <small className="text-muted">
                                {formatDate(data.schedule_start, 'MMM D, YYYY')} -{' '}
                                {formatDate(data.schedule_end, 'MMM D, YYYY')}
                              </small>
                            </div>
                            <div>
                              {/* <strong>Salary</strong>
                              <br /> */}
                              <FontAwesomeIcon icon={faCoins} className="me-2" />
                              <small className="text-muted">
                                {formatCurency(data.salary_min)} - {formatCurency(data.salary_max)}
                              </small>
                            </div>
                            <br />
                            <div>
                              <strong>Description</strong>
                              <br />
                              <small className="text-muted">
                                {trimString(data.description, 150)}
                              </small>
                            </div>
                            <br />
                            <div className="d-flex justify-content-end">
                              <CButton
                                onClick={() => handleEdit(data._id)}
                                color="primary"
                                size="sm"
                              >
                                <FontAwesomeIcon icon={faPencil} className="me-2" />
                                Edit
                              </CButton>
                            </div>
                          </CCardBody>
                        </CCard>
                      </CCol>
                    )
                  })}
                </CRow>
              ) : (
                <CListGroup>
                  {allData.map((data) => {
                    if (!data) {
                      return null
                    }
                    return (
                      <CListGroupItem key={data._id}>
                        <CContainer>
                          <CRow>
                            <CCol>
                              <h4 className="fw-bold text-capitalize">{data.title}</h4>
                            </CCol>
                          </CRow>
                          <CRow>
                            <CCol>
                              <div>
                                <FontAwesomeIcon icon={faGlobe} className="me-2" />
                                <small className="text-muted text-capitalize">
                                  {data.location}
                                </small>
                              </div>
                              <div>
                                {/* <strong>Status</strong> */}
                                {/* <br /> */}
                                <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                                {data.status === 'active' ? (
                                  <small className="text-success">Active</small>
                                ) : (
                                  <small className="text-danger">Inactive</small>
                                )}
                              </div>
                              <div>
                                {/* <strong>Deployment</strong>
                              <br /> */}
                                <FontAwesomeIcon icon={faCalendar} className="me-2" />
                                <small className="text-muted">
                                  {formatDate(data.schedule_start, 'MMM D, YYYY')} -{' '}
                                  {formatDate(data.schedule_end, 'MMM D, YYYY')}
                                </small>
                              </div>
                              <div>
                                {/* <strong>Salary</strong>
                              <br /> */}
                                <FontAwesomeIcon icon={faMoneyBill} className="me-2" />
                                <small className="text-muted">
                                  {formatCurency(data.salary_min)} -{' '}
                                  {formatCurency(data.salary_max)}
                                </small>
                              </div>
                              <br />
                            </CCol>
                            <CCol>
                              <div>
                                <div>
                                  <strong>Description</strong>
                                  <br />
                                  <small className="text-muted">
                                    {trimString(data.description, 150)}
                                  </small>
                                </div>
                                <br />
                                <div className="d-flex justify-content-end">
                                  <CButton
                                    onClick={() => handleEdit(data._id)}
                                    color="primary"
                                    size="sm"
                                  >
                                    <FontAwesomeIcon icon={faPencil} className="me-2" />
                                    Edit
                                  </CButton>
                                </div>
                              </div>
                            </CCol>
                          </CRow>
                        </CContainer>
                      </CListGroupItem>
                    )
                  })}
                </CListGroup>
              )}
            </div>
          )}
          <div className="mt-3 d-flex flex-row gap-2 justify-content-center align-items-center">
            <AppPagination
              currentPage={currentPage}
              totalPages={totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </div>
        </CRow>
      </CContainer>
    </>
  )
}

export default Jobposting
