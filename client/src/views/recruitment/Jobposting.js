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
  CCardHeader,
  CCardFooter,
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormCheck,
  CFormFeedback,
  CCollapse,
  CTooltip,
  CInputGroup,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faChevronUp,
  faLocationPin,
  faMoneyBill,
  faRefresh,
  faPencil,
  faCalendar,
  faSearch,
} from '@fortawesome/free-solid-svg-icons'
import AppPagination from '../../components/AppPagination'
import { formattedDate, formattedDateMMM, formatCurency, trimString } from '../../utils'
const Jobposting = () => {
  const { addToast } = useContext(AppContext)

  const [isFormExpanded, setIsFormExpanded] = useState(false)
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

  const today = new Date()
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
      jpfSchedStart: z.preprocess(
        (val) => new Date(val),
        z.date().min(yesterday, { message: 'Start Date must be today or later' }),
      ),
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
        setIsFormExpanded(true)
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
          jpfSchedStart: formattedDate(res.data.data.schedule_start),
          jpfSchedEnd: formattedDate(res.data.data.schedule_end),
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
    setIsFormExpanded(false)
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
      jpfSchedStart: new Date(),
      jpfSchedEnd: new Date(),
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
        setIsLoading(false)
      } else {
        addToast('Jobposting', 'Error getting jobposting', 'danger')
        console.log('Error: ', res.data)
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
  const {
    register: searchRegister,
    handleSubmit: searchHandleSubmit,
    formState: { searchError },
  } = useForm({
    resolver: zodResolver(searchSchema),
    // resolver: async (data, context, options) => {
    //   const result = await zodResolver(searchSchema)(data, context, options)
    //   console.log('Validation result:', result)
    //   return result
    // },
  })
  const searchSubmit = async (data) => {
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
      <CContainer className="d-flex flex-column gap-3 mb-3">
        <CRow>
          <CContainer>
            <CCard>
              <CCardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-2 justify-content-between align-items-center">
                    <strong>Jobposting Form</strong>
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
                  <div className="d-flex gap-2 justify-content-between align-items-center">
                    {isEdit && (
                      <CTooltip content="Reset Fields" placement="top">
                        <CButton
                          type="button"
                          onClick={() => handleEditReset()}
                          className="btn btn-danger w-30"
                        >
                          <FontAwesomeIcon icon={faRefresh} />
                        </CButton>
                      </CTooltip>
                    )}
                    <CTooltip content={isFormExpanded ? 'Collapse' : 'Expand'} placement="top">
                      <CButton
                        type="button"
                        onClick={() => setIsFormExpanded(!isFormExpanded)}
                        className="btn btn-primary w-30"
                      >
                        {isFormExpanded ? (
                          <FontAwesomeIcon icon={faChevronUp} />
                        ) : (
                          <FontAwesomeIcon icon={faChevronDown} />
                        )}
                      </CButton>
                    </CTooltip>
                  </div>
                </div>
              </CCardHeader>
              <CCollapse visible={isFormExpanded}>
                <CCardBody>
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
                            defaultValue={formattedDate(today)}
                            {...formRegister('jpfSchedStart', {
                              valueAsDate: true,
                            })}
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
                            defaultValue={formattedDate(tommorrow)}
                            {...formRegister('jpfSchedEnd', {
                              valueAsDate: true,
                            })}
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
                      <div className="d-flex justify-content-end">
                        <CButton
                          color="primary"
                          type="submit"
                          disabled={!isChecked}
                          className="mb-3 w-25"
                        >
                          {isEdit ? 'Update' : 'Add'}
                        </CButton>
                      </div>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCollapse>
            </CCard>
          </CContainer>
        </CRow>
        <CRow className="d-flex gap-2 justify-content-between align-items-center">
          <CContainer>
            <CForm
              onSubmit={searchHandleSubmit(searchSubmit)}
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
                  <CButton type="submit" className="btn btn-primary">
                    <FontAwesomeIcon icon={faSearch} />
                  </CButton>
                </CTooltip>
                <CTooltip content="Reset" placement="top">
                  <CButton onClick={() => resetData()} type="button" className="btn btn-primary">
                    <FontAwesomeIcon icon={faRefresh} />
                  </CButton>
                </CTooltip>
              </CInputGroup>
            </CForm>
          </CContainer>
        </CRow>
        <CRow>
          {isLoading ? (
            <div>Loading</div>
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
                        <CCard className="mb-3 h-100">
                          <CCardHeader className="fw-bold text-uppercase text-primary">
                            <div>
                              <span
                                className={
                                  data.status === 'active'
                                    ? 'badge rounded-pill text text-success'
                                    : 'badge rounded-pill text text-danger'
                                }
                              >
                                {data.status === 'active' ? 'Active' : 'Inactive'}
                              </span>
                              <p className="fw-bold text-uppercase text-primary">{data.title}</p>
                            </div>
                          </CCardHeader>
                          <CCardBody>
                            <div className="d-flex flex-column justify-content-between">
                              <div className="d-flex flex-row gap-2 justify-content-start">
                                <FontAwesomeIcon icon={faLocationPin} />
                                <p>{data.location}</p>
                              </div>
                              <div className="d-flex flex-row gap-2 justify-content-start">
                                <FontAwesomeIcon icon={faCalendar} />
                                <p>
                                  {formattedDateMMM(data.schedule_start)} -{' '}
                                  {formattedDateMMM(data.schedule_end)}
                                </p>
                              </div>
                              <div className="d-flex flex-row gap-2 justify-content-start">
                                <FontAwesomeIcon icon={faMoneyBill} />
                                <p>
                                  {formatCurency(data.salary_min)} -{' '}
                                  {formatCurency(data.salary_max)}
                                </p>
                              </div>
                              <div>
                                <p className="fw-bold text-uppercase">Description</p>
                                <p>{trimString(data.description, 150)}</p>
                              </div>
                            </div>
                          </CCardBody>
                          <CCardFooter>
                            <div className="d-flex justify-content-end">
                              <CButton
                                onClick={() => handleEdit(data._id)}
                                className="btn btn-outline-primary d-flex flex-row gap-2 justify-content-center align-items-center"
                              >
                                <FontAwesomeIcon icon={faPencil} />
                                Edit
                              </CButton>
                            </div>
                          </CCardFooter>
                        </CCard>
                      </CCol>
                    )
                  })}
                </CRow>
              ) : (
                <ul className="list-group list-group-flush">
                  {allData.map((data) => {
                    if (!data) {
                      return null
                    }
                    return (
                      <li key={data._id} className="list-group-item">
                        <div>
                          <span
                            className={
                              data.status === 'active'
                                ? 'badge rounded-pill text text-bg-success'
                                : 'badge rounded-pill text text-danger'
                            }
                          >
                            {data.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                          <p className="fw-bold text-uppercase text-primary">{data.title}</p>
                        </div>
                        <div className="d-flex flex-row gap-2 justify-content-start">
                          <FontAwesomeIcon icon={faLocationPin} />
                          <div>{data.location}</div>
                        </div>
                        <div className="d-flex flex-row gap-2 justify-content-start">
                          <FontAwesomeIcon icon={faCalendar} />
                          <p>
                            {formattedDateMMM(data.schedule_start)} -{' '}
                            {formattedDateMMM(data.schedule_end)}
                          </p>
                        </div>
                        <div className="d-flex flex-row gap-2 justify-content-start">
                          <FontAwesomeIcon icon={faMoneyBill} />
                          <p>
                            {formatCurency(data.salary_min)} - {formatCurency(data.salary_max)}
                          </p>
                        </div>
                        <div>
                          <p className="fw-bold text-uppercase">Description</p>
                          <p>{trimString(data.description, 150)}</p>
                        </div>
                        <div className="d-flex justify-content-end">
                          <div className="d-flex justify-content-end">
                            <CButton
                              onClick={() => handleEdit(data._id)}
                              className="btn btn-outline-primary d-flex flex-row gap-2 justify-content-center align-items-center"
                            >
                              <FontAwesomeIcon icon={faPencil} />
                              Edit
                            </CButton>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}
          <div className="mt-3 d-flex flex-row gap-2 justify-content-center align-items-center">
            <AppPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </CRow>
      </CContainer>
    </>
  )
}

export default Jobposting
