import React, { useState, useEffect } from 'react'
import { set, z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { post, put, get, del } from '../../api/axios';

import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
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
} from '@coreui/react'
import { CChart } from "@coreui/react-chartjs";

import { pdfjs, Document, Page } from 'react-pdf';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faMinus, faPlus, faTrash, faRefresh, faPencil } from '@fortawesome/free-solid-svg-icons';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Applicant = () => {
  const [isFormExpanded, setIsFormExpanded] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  const [data, setData] = useState({})
  const [allData, setAllData] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [searchMode, setSearchMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isFormChecked, setIsFormChecked] = useState(false)
  const [pdfScale, setPdfScale] = useState(1.0)

  const applicantSchema = z.object({
    id: z.string().optional(),
    firstname: z.string()
      .min(2, { message: 'First name must be at least 2 characters long' })
      .max(255, { message: 'First name must be at most 255 characters long' }),
    lastname: z.string()
      .min(2, { message: "Last name must be at least 3 characters long" })
      .max(255, { message: "Last name must be at most 255 characters long" }),
    middlename: z.string()
      .max(255, { message: 'Middle name must be at most 255 characters long' }),
    email: z.string().email(),
    phone: z.string().min(10).max(20).refine((phone) => {
      return phone.match(/^[0-9]+$/) !== null
    }, { message: 'Phone number must be numeric' }),
    address: z.string().min(10).max(255),
    file: z
      .any()
      .refine((file) => file.length > 0, {
        message: 'File is required',
      })
      // its a bird, its a plane, its a superRefine! 
      // Can't help but think of the Superfriends when I see this

      .superRefine((file, ctx) => {
        if (file[0]) {
          if (file[0].type !== 'application/pdf') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'File must be a PDF',
            });
          }
          if (file[0].size >= 5000000) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'File must be less than 5MB',
            });
          }
        }
      })
  })

  const {
    register,
    handleSubmit,
    reset: formReset,
    formState: { errors },
  } = useForm({
    // resolver: zodResolver(fileSchema)

    resolver: async (data, context, options) => {
      const result = await zodResolver(applicantSchema)(data, context, options);
      console.log("Validation result:", result);
      return result;
    },
  })

  const handlePreview = (data) => {
    try {
      // console.log(data)
      const x = {
        ...data, file: data.file[0]
      }
      setIsFormExpanded(false)
      setIsPreview(true)
      setData(x)
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpload = async () => {
    try {
      console.log("ID: ", data.id)
      const formData = new FormData()
      formData.append('firstname', data.firstname)
      formData.append('lastname', data.lastname)
      formData.append('middlename', data.middlename)
      formData.append('email', data.email)
      formData.append('phone', data.phone)
      formData.append('address', data.address)
      formData.append('file', data.file)

      const res = isEdit
        ? await put(`/applicant/${data.id}`, formData)
        : await post(`/applicant`, formData)
      console.log(res)
      if (res.success === true) {
        alert(res.message)
        getAllData()
        handleReset();
        setIsPreview(false)

      } else {
        console.log('Failed')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getAllData = async () => {
    try {
      setIsLoading(true)
      const res = await get('/applicant/all')
      if (res.success === true) {
        setAllData(res.data)
        setIsLoading(false)
      } else {
        console.log('Failed')
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = async (id) => {
    try {
      // console.log(data)
      const res = await get(`/applicant/${id}`)
      if (res.success === true) {
        formReset({
          id: res.data._id,
          firstname: res.data.firstName,
          lastname: res.data.lastName,
          middlename: res.data.middleName,
          email: res.data.email,
          phone: res.data.phone,
          address: res.data.address,

        })
        setIsEdit(true)
        setIsFormExpanded(true)
      }
      else {
        alert('Failed')
        console.log('Failed')
      }
      setIsEdit(true)
      setIsFormExpanded(true)

    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (data) => {
    try {
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
    formReset(
      {
        firstname: '',
        lastname: '',
        middlename: '',
        email: '',
        phone: '',
        address: '',
        file: ''
      }
    )
    setIsEdit(false)
    setIsFormExpanded(false)
  }

  // Search
  const searchSchema = z.object({
    searchInput: z.string().min(2).max(255)
  })
  const {
    register: searchRegister,
    handleSubmit: searchHandleSubmit,
    formState: { errors: searchErrors }
  } = useForm({
    resolver: async (data, context, options) => {
      const result = await zodResolver(searchSchema)(data, context, options);
      console.log("Validation result:", result);
      return result;
    },
  })

  const searchSubmit = async (searchInput) => {
    try {
      setIsLoading(true)
      const res = await get(`/applicant/search/${searchInput}`)
      if (res.success === true) {
        setAllData(res.data)
        setIsLoading(false)
      } else {
        console.log('Failed')
        setIsLoading(false)
      }
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

  const [stats, setStats] = useState({
    applications: [
      {
        name: 'Total',
        color: 'info',
        value: 0,
        data: [0, 0, 0, 0, 0, 0, 0],
      }, {
        name: 'Active',
        color: 'success',
        value: 0,
        data: [0, 0, 0, 0, 0, 0, 0],
      }
    ],
  })


  useEffect(() => {
    getAllData()
  }, [])

  return (
    <CContainer className='d-flex flex-column gap-2 mb-3'>
      <CRow className='d-flex justify-content-center '>
        {
          stats.applications.map((stat, index) => {
            return (
              <CCol key={index} sm={6} xl={4} xxl={3}>
                <CWidgetStatsA
                  className='mb-4'
                  color={stat.color}
                  value={
                    <>
                      <div className="fs-2 ">
                        {stat.value}
                      </div>
                    </>
                  }
                  title={stat.name}
                  chart={
                    <CChart
                      className='mt-3'
                      style={{ height: '70px' }}
                      type='line'
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
          })
        }
      </CRow>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader className='d-flex justify-content-between align-items-center'>
              <div className='d-flex gap-2 justify-content-between align-items-center'>
                <strong>Resume Form</strong>
                <span className={
                  isEdit
                    ? "badge rounded-pill text text-danger"
                    : "badge rounded-pill text text-success"
                }>
                  {
                    isEdit
                      ? "Edit Mode"
                      : "Create Mode"
                  }
                </span>
              </div>
              <div className='d-flex justify-content-end gap-2'>
                {
                  isEdit && (
                    <CTooltip
                      content='Reset'
                      placement='top'
                    >
                      <CButton className='btn btn-danger' onClick={() => handleReset()}>
                        <FontAwesomeIcon icon={faTrash}>
                        </FontAwesomeIcon>
                      </CButton>
                    </CTooltip>
                  )
                }
                <CTooltip
                  content='Expand'
                  placement='top'
                >
                  <CButton className='btn btn-primary' onClick={() => setIsFormExpanded(!isFormExpanded)} >
                    <FontAwesomeIcon icon={
                      isFormExpanded ? faChevronUp : faChevronDown
                    }></FontAwesomeIcon>
                  </CButton>
                </CTooltip>

              </div>
            </CCardHeader>
            <CCollapse visible={isFormExpanded}>
              <CCardBody>
                <CForm
                  onSubmit={handleSubmit(handlePreview)}
                  className='d-flex flex-column gap-3'
                >
                  <div className='visually-hidden'>
                    <CFormInput
                      type='text'
                      id='id'
                      placeholder='...'
                      label='ID'
                      {...register('id')}
                      invalid={!!errors.id}
                    />
                    {
                      errors.id &&
                      <CFormFeedback className='text-danger'>
                        {errors.id.message}
                      </CFormFeedback>
                    }
                  </div>
                  <div>
                    <CFormInput
                      type='text'
                      id='firstname'
                      placeholder='Maria'
                      label='First Name'
                      {...register('firstname')}
                      invalid={!!errors.firstname}
                    />
                    {
                      errors.firstname &&
                      <CFormFeedback className='text-danger'>
                        {errors.firstname.message}
                      </CFormFeedback>
                    }
                  </div>
                  <div>
                    <CFormInput
                      type='text'
                      id='lastname'
                      placeholder='Clara'
                      label='Last Name'
                      {...register('lastname')}
                      invalid={!!errors.lastname}
                    />
                    {
                      errors.lastname &&
                      <CFormFeedback className='text-danger'>
                        {errors.lastname.message}
                      </CFormFeedback>
                    }
                  </div>
                  <div>
                    <CFormInput
                      type='text'
                      id='middlename'
                      placeholder='...'
                      label='Middle Name'
                      {...register('middlename')}
                      invalid={!!errors.middlename}
                    />
                    {
                      errors.middlename &&
                      <CFormFeedback className='text-danger'>
                        {errors.middlename.message}
                      </CFormFeedback>
                    }
                  </div>
                  <div>
                    <CFormInput
                      type='email'
                      id='email'
                      placeholder='user@mail.com'
                      label='Email'
                      {...register('email')}
                      invalid={!!errors.email}
                    />
                    {
                      errors.email &&
                      <CFormFeedback className='text-danger'>
                        {errors.email.message}
                      </CFormFeedback>
                    }
                  </div>
                  <div>
                    <CFormInput
                      type='text'
                      id='phone'
                      placeholder='1234567890'
                      label='Phone'
                      {...register('phone')}
                      invalid={!!errors.phone}
                    />
                    {
                      errors.phone &&
                      <CFormFeedback className='text-danger'>
                        {errors.phone.message}
                      </CFormFeedback>
                    }
                  </div>
                  <div>
                    <CFormTextarea
                      id='address'
                      placeholder='Enter Address'
                      label='Address'
                      {...register('address')}
                      invalid={!!errors.address}
                    />
                    {
                      errors.address &&
                      <CFormFeedback className='text-danger'>
                        {errors.address.message}
                      </CFormFeedback>
                    }
                  </div>
                  <div>
                    <CFormInput
                      type='file'
                      id='file'
                      placeholder='Enter Title'
                      label='Resume'
                      {...register('file')}
                      invalid={!!errors.file}
                    />
                    {
                      errors.file &&
                      <CFormFeedback className='text-danger'>
                        {errors.file.message}
                      </CFormFeedback>
                    }
                  </div>
                  <div className='d-flex justify-content-end mt-2'>
                    <CButton type='submit' color='primary' >
                      {
                        isEdit ? 'Update' : 'Submit'
                      }
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCollapse>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CModal
            scrollable={true}
            alignment='center'
            visible={isPreview}
            onClose={() => setIsPreview(false)}
            size='xl'
          >
            <CModalHeader>
              <CModalTitle>
                Preview {
                  isEdit ? 'Update' : 'Submission'
                }
              </CModalTitle>
            </CModalHeader>
            {
              data &&
              <CModalBody>
                <div className='h6 fw-bold'>
                  Please check the details before submitting.
                </div>
                <div>
                  <div>
                    <strong>
                      First Name:
                    </strong>
                    <p>
                      {data.firstname}
                    </p>
                  </div>
                  <div>
                    <strong>
                      Last Name:
                    </strong>
                    <p>
                      {data.lastname}
                    </p>
                  </div>
                  <div>
                    <strong>
                      Middle Name:
                    </strong>
                    <p>
                      {data.middlename}
                    </p>
                  </div>
                  <div>
                    <strong>
                      Email:
                    </strong>
                    <p>
                      {data.email}
                    </p>
                  </div>
                  <div>
                    <strong>
                      Phone:
                    </strong>
                    <p>
                      {data.phone}
                    </p>
                  </div>
                  <div>
                    <strong>
                      Address:
                    </strong>
                    <p>
                      {data.address}
                    </p>
                  </div>
                </div>
                <hr />
                {/* <div className='d-flex justify-content-end'>
                  <CButton type='button' onClick={() => setPdfScale(prev => prev + 0.1)}>
                    <FontAwesomeIcon icon={faPlus} />
                  </CButton>
                  <CButton type='button' onClick={() => setPdfScale(prev => prev - 0.1)}>
                    <FontAwesomeIcon icon={faMinus} />
                  </CButton>
                </div> */}
                <Document
                  file={data.file}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page pageNumber={pageNumber} />
                </Document>
              </CModalBody>
            }
            <CModalFooter>
              <div>
                {/* checkbox */}
                <div className='form-check d-flex justify-content-end'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    id='flexCheckDefault'
                    onChange={() => setIsFormChecked(!isFormChecked)}
                  />
                  <label className='form-check-label' htmlFor='flexCheckDefault'>
                    I have checked the details
                  </label>
                </div>
              </div>
              <CButton color='primary' onClick={() => handleUpload()} disabled={isFormChecked}>
                {
                  isEdit ? 'Update' : 'Submit'
                }
              </CButton>
            </CModalFooter>
          </CModal>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <CForm onSubmit={searchHandleSubmit(searchSubmit)}
                className='d-flex flex-row gap-2 justify-content-end align-items-center'>
                <div>
                  <CFormInput
                    type="text"
                    id="searchInput"
                    name="searchInput"
                    placeholder="..."
                    {
                    ...searchRegister('searchInput')
                    }
                    invalid={!!searchErrors.searchInput}
                  />
                  {
                    searchErrors.searchInput &&
                    <CFormFeedback className="text-danger">
                      {searchErrors.searchInput.message}
                    </CFormFeedback>
                  }
                </div>
                <CButton type='submit' className='btn btn-primary'>
                  Search
                </CButton>
                <CButton onClick={() => resetAllData()} type='button' className='btn btn-primary'>
                  <FontAwesomeIcon icon={faRefresh} />
                </CButton>
              </CForm>
            </CCardHeader>
            <CCardBody>
              {
                isLoading
                  ? (
                    <p>
                      Loading...
                    </p>
                  )
                  : (
                    <div>
                      <ul className='list-group'>
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
                      </ul>
                    </div>
                  )
              }
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer >
  )
}
export default Applicant
