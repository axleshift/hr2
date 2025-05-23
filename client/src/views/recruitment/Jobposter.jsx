import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { post, get, del } from '../../api/axios'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
  CFormFeedback,
  CCollapse,
  CButtonGroup,
  CBadge,
  CTooltip,
  CInputGroupText,
  CInputGroup,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
} from '@coreui/react'

import {
  faChevronDown,
  faChevronUp,
  faLocationPin,
  faMoneyBill,
  faTrash,
  faCalendar,
  faClipboardQuestion,
} from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AppContext } from '../../context/appContext'

import { formatCurrency, formatDate, trimString } from '../../utils'

const Jobposter = () => {
  const sectionRefs = {}
  const { addToast } = useContext(AppContext)
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isTrackerLoading, setIsTrackerLoading] = useState(true)
  const [data, setData] = useState([])
  const [trackerData, setTrackerData] = useState([])
  const [isExpanded, setIsExpanded] = useState({
    jobposting: true,
    jobposter: true,
    tracker: true,
  })
  const [edit, setEdit] = useState({
    twitter: false,
    facebook: false,
  })

  const handleExpand = (key) => {
    setIsExpanded({ ...isExpanded, [key]: !isExpanded[key] })
  }

  const getData = async () => {
    try {
      setIsLoading(true)
      const res = await get(`/jobposting/${id}`)
      if (res.status === 200 || res.status === 201) {
        setData(res.data.data)
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getTrackerData = async () => {
    try {
      setIsTrackerLoading(true)
      const res = await get(`/jobposter/${id}`)
      if (res.status === 200 || res.status === 201) {
        setTrackerData(res.data.data)
        setIsTrackerLoading(false)
      }
    } catch (error) {
      console.log(error)
      setIsTrackerLoading(false)
    }
  }

  const deleteTrackerData = async (id) => {
    try {
      const res = await del(`/jobposter/${id}`)
      console.log('deleteTrackerData:', res)
      if (res.status === 200) {
        addToast('Success', 'Deleted successfully', 'success')
        getData()
        getTrackerData()
      } else {
        addToast('Failed', 'Failed to delete', 'danger')
      }
      getTrackerData()
    } catch (error) {
      console.log(error)
    }
  }

  const twitterFormSchema = z.object({
    twitterText: z
      .string()
      .min(1, { message: 'Please enter a valid text' })
      .max(280, { message: 'Max of 280 characters' })
      .optional(),
  })

  const {
    register: twitterRegister,
    reset: twitterReset,
    handleSubmit: twitterHandleSubmit,
    formState: { errors: twitterErrors },
  } = useForm({
    resolver: async (data, context, options) => {
      const result = await zodResolver(twitterFormSchema)(data, context, options)
      console.log('Validation result:', result)
      return result
    },
  })

  const facebookFormSchema = z.object({
    text: z.string().min(1, { message: 'Please enter a valid text' }).optional(),
  })

  const {
    register: facebookRegister,
    handleSubmit: facebookHandleSubmit,
    formState: { errors: facebookErrors },
  } = useForm({
    resolver: async (data, context, options) => {
      const result = await zodResolver(facebookFormSchema)(data, context, options)
      console.log('Validation result:', result)
      return result
    },
  })

  const submitSummary = async (data) => {
    try {
      const content = {
        twitter: data.twitterText,
        facebook: data.facebookText,
      }
      const res = await post(`/jobposter/${id}/post`, content)
      if (res.status === 201) {
        addToast('Success', 'Posted successfully', 'success')
        getData()
        getTrackerData()
      } else {
        console.log('submitSummary: ', res)
        addToast('Failed', 'Failed to post', 'danger')
      }
    } catch (error) {
      // console.log("ERROR", error);
      addToast('Failed', 'Failed to post', 'danger')
    }
  }

  const editSummary = async (item, platform) => {
    try {
      if (platform === 'twitter') {
        const content = {
          twitterText: item.content,
        }
        setEdit((prevEdit) => ({ ...prevEdit, twitter: true }))
        twitterReset(content)
        addToast('Success', 'Post Fetched', 'success')

        // Scroll to twitter form
        sectionRefs.twitterForm.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData()
    getTrackerData()
  }, [])

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <CContainer className="d-flex flex-column gap-2 mb-3">
          <CRow>
            <CCol>
              <h2>Job Posting Details</h2>
              <small>
                This is the job posting details. It will show the details of the job posting.
              </small>
            </CCol>
            <CCol className="d-flex justify-content-end">
              <div>
                <CTooltip
                  content={
                    isExpanded.jobposting ? 'Hide Job Posting Details' : 'Show Job Posting Details'
                  }
                  placement="top"
                >
                  <CButton color="primary" onClick={() => handleExpand('jobposting')}>
                    <FontAwesomeIcon icon={isExpanded.jobposting ? faChevronUp : faChevronDown} />
                  </CButton>
                </CTooltip>
              </div>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CCollapse visible={isExpanded.jobposting}>
                <CContainer className="d-flex flex-column gap-2">
                  <CRow>
                    <CCol>
                      <CTooltip
                        content={
                          data.status?.toLowerCase() === 'active'
                            ? 'This is an active job posting. This means that the job is currently open and accepting applications and have posted on social media.'
                            : 'This is an inactive job posting. This means that the job posting is currently closed and not accepting applications.'
                        }
                        placement="top"
                      >
                        <CBadge
                          color={data.status?.toLowerCase() === 'active' ? 'success' : 'danger'}
                          className="text-capitalize"
                        >
                          {data.status}
                        </CBadge>
                      </CTooltip>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CFormInput
                        id="title"
                        name="title"
                        label="Title"
                        value={data.title}
                        readOnly
                      />
                    </CCol>
                    <CCol>
                      <CFormInput id="type" name="type" label="Type" value={data.type} readOnly />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <label htmlFor="">Location</label>
                      <CInputGroup className="mt-2">
                        <CInputGroupText>
                          <FontAwesomeIcon icon={faLocationPin} />
                        </CInputGroupText>
                        <CFormInput id="location" name="location" value={data.location} readOnly />
                      </CInputGroup>
                    </CCol>
                    <CCol>
                      <label htmlFor="">Salary</label>
                      <CInputGroup className="mt-2">
                        <CInputGroupText>
                          <FontAwesomeIcon icon={faMoneyBill} />
                        </CInputGroupText>
                        <CFormInput
                          id="salarymin"
                          name="salarymin"
                          value={formatCurrency(data.salary_min)}
                          readOnly
                        />
                        <CFormInput
                          id="salarymax"
                          name="salarymax"
                          value={formatCurrency(data.salary_max)}
                          readOnly
                        ></CFormInput>
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <label htmlFor="">Description</label>
                      <CFormTextarea
                        id="description"
                        name="description"
                        value={data.description}
                        readOnly
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <label htmlFor="">Responsibilities</label>
                      <CFormTextarea
                        id="responsibilities"
                        name="responsibilities"
                        value={data.responsibilities}
                        readOnly
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <label htmlFor="">Requirements</label>
                      <CFormTextarea
                        id="requirements"
                        name="requirements"
                        value={data.requirements}
                        readOnly
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <label htmlFor="">Benefits</label>
                      <CFormTextarea id="benefits" name="benefits" value={data.benefits} readOnly />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <label htmlFor="">Schedule</label>
                      <CInputGroup className="mt-2">
                        <CInputGroupText>
                          <FontAwesomeIcon icon={faCalendar} />
                        </CInputGroupText>
                        <CInputGroupText>Start</CInputGroupText>
                        <CFormInput
                          type="date"
                          id="scheduleStart"
                          name="scheduleStart"
                          value={formatDate(data.schedule_start)}
                          readOnly
                        />
                        <CInputGroupText>End</CInputGroupText>
                        <CFormInput
                          type="date"
                          id="scheduleEnd"
                          name="scheduleEnd"
                          value={formatDate(data.schedule_end)}
                          readOnly
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>
                </CContainer>
              </CCollapse>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              {/* Twitter Post */}
              <hr />
              <CContainer>
                <CForm
                  onSubmit={twitterHandleSubmit(submitSummary)}
                  className="d-flex flex-column gap-2"
                  classID="twitterForm"
                  ref={(el) => (sectionRefs.twitterForm = el)}
                >
                  <h2>Create Post</h2>
                  <div>
                    <CFormLabel className="d-flex flex-row gap-2 justify-items-center align-items-center">
                      <FontAwesomeIcon icon={faTwitter} className="text-info" />
                      <strong>Create Twitter Post (280 characters)</strong>
                    </CFormLabel>
                    <CFormTextarea
                      id="twitterText"
                      name="twitterText"
                      placeholder="Twitter Post description.."
                      defaultValue={`NOW HIRING! \n${data.title}\nLocation: ${data.location}\nSalary: ${formatCurrency(data.salary_min)} - ${formatCurrency(data.salary_max)}\n=====\nPM me for more details!`}
                      {...twitterRegister('twitterText')}
                      invalid={!!twitterErrors.twitterText}
                      className="scalableCFormTextArea-200"
                    />
                    <small className="text-muted">
                      If left blank, the default text will be used.
                    </small>
                    <br />
                    <small className="text-muted mb-3">
                      This summary will be posted on <span className="text-info">twitter</span>,
                      with a character limit of 280 characters. Due to this limitation, we recommend
                      keeping the summary short and sweet.
                    </small>
                    {twitterErrors.twitterText && (
                      <CFormFeedback invalid>{twitterErrors.twitterText.message}</CFormFeedback>
                    )}
                  </div>
                  <div className="d-flex justify-content-end">
                    <CButton color="primary" type="submit" className="mb-3">
                      Post Tweet
                    </CButton>
                  </div>
                </CForm>
              </CContainer>
              {/* Facebook Post */}
              {/* <CForm
                    onSubmit={facebookHandleSubmit(submitSummary)}
                    className='d-flex flex-column gap-2'
                  >
                    <div>
                      <CFormLabel className='d-flex flex-row gap-2 justify-items-center'>
                        <FontAwesomeIcon icon={faFacebook} className='text-primary' />
                        <strong>
                          Create Facebook Post
                        </strong>
                      </CFormLabel>
                      <CFormTextarea
                        id='facebookText'
                        name='facebookText'
                        placeholder='Facebook Post description..'
                        defaultValue={
                          `NOW HIRING! \n${data.title}\nLocation: ${data.location}\nSalary: ${formatCurrency(data.salary_min)} - ${formatCurrency(data.salary_max)}\n=====\nPM me for more details!`
                        }
                        {...facebookRegister('facebookText')}
                        invalid={!!errors.text}
                        className='mh-100'
                      />
                      <div style={{ fontSize: '10px' }} className='text-muted mb-3'>
                        This summary will be posted on <span className='text-primary'>
                          facebook</span>, with no character limit. Due to this limitation, we recommend keeping the summary short and sweet.
                      </div>
                      {errors.facebookText && <CFormFeedback invalid>{errors.facebookText.message}</CFormFeedback>}
                    </div>
                    <div className='d-flex justify-content-end'>
                      <CButton
                        color='primary'
                        type='submit'
                        className='mb-3 '
                      >
                        Post
                      </CButton>
                    </div>
                  </CForm> */}
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CContainer>
                <div>
                  <hr />

                  <h2>Tracker</h2>
                  <small>
                    This is a tracker for the job posting. It will show the status of the job
                    postings on various platforms.
                  </small>
                </div>
                <CCard>
                  <CCardBody>
                    <CTable align="middle" hover responsive striped>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>
                            <div className="text-center">
                              <strong>#</strong>
                            </div>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <div className="text-center">Platform</div>
                          </CTableHeaderCell>
                          {/* <CTableHeaderCell>
                            <div className="text-center">Status</div>
                          </CTableHeaderCell> */}
                          <CTableHeaderCell>
                            <div className="text-center">Posted</div>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <div className="text-center">Deleted</div>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <div className="text-center">Expires At</div>
                          </CTableHeaderCell>
                          <CTableHeaderCell>Content </CTableHeaderCell>
                          <CTableHeaderCell>
                            <div className="text-center">Actions</div>
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {isTrackerLoading ? (
                          <CTableRow>
                            <CTableDataCell colSpan="7">Loading...</CTableDataCell>
                          </CTableRow>
                        ) : (
                          trackerData.map((item, index) => {
                            if (!item) return null
                            return (
                              <CTableRow key={item._id}>
                                <CTableDataCell>
                                  <CTooltip content={item._id} placement="top">
                                    <div className="text-capitalize text-center">
                                      {trimString(item._id, 2)}
                                    </div>
                                  </CTooltip>
                                </CTableDataCell>
                                <CTableDataCell>
                                  <div className="text-capitalize text-center">{item.platform}</div>
                                </CTableDataCell>
                                {/* <CTableDataCell className="text-center">
                                  <CBadge color={item.status === 'active' ? 'success' : 'danger'}>
                                    {item.status === 'active' ? 'Active' : 'Inactive'}
                                  </CBadge>
                                </CTableDataCell> */}
                                <CTableDataCell className="text-center">
                                  {item.isPosted ? (
                                    <CBadge color="success">YES</CBadge>
                                  ) : (
                                    <CBadge color="danger">NO</CBadge>
                                  )}
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                  {item.isDeleted ? (
                                    <CBadge color="success">YES</CBadge>
                                  ) : (
                                    <CBadge color="danger">NO</CBadge>
                                  )}
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                  <span className="text-info">{formatDate(item.expiresAt)}</span>
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CTooltip content={item.content} placement="top">
                                    <small>{trimString(item.content, 50)}</small>
                                  </CTooltip>
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                  <CButtonGroup>
                                    <CTooltip content="Delete" placement="top">
                                      <CButton
                                        color="danger"
                                        onClick={() => deleteTrackerData(item._id)}
                                      >
                                        <FontAwesomeIcon icon={faTrash} />
                                      </CButton>
                                    </CTooltip>
                                    <CTooltip content="Use as Template" placement="top">
                                      <CButton
                                        color="info"
                                        onClick={() => editSummary(item, item.platform)}
                                      >
                                        <FontAwesomeIcon icon={faClipboardQuestion} />
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

                {/* <CRow xs={{ cols: 1 }} md={{ cols: 3 }} className="g-3">
                  {trackerData.map((item, index) => {
                    if (!item) return null
                    return (
                      <CCol key={item._id}>
                        <CCard className="mb-3 h-100">
                          <CCardHeader className="d-flex flex-row gap-2 align-items-center">
                            <div>
                              <FontAwesomeIcon
                                icon={item.platform === 'twitter' ? faTwitter : faFacebook}
                                className={
                                  item.platform === 'twitter' ? 'text-info' : 'text-primary'
                                }
                              />
                            </div>
                            <strong className="text-uppercase">{item.platform}</strong>
                          </CCardHeader>
                          <CCardBody>
                            <div className="d-flex gap-2">
                              <CBadge color={item.status === 'active' ? 'success' : 'danger'}>
                                {item.status === 'active' ? 'Active' : 'Inactive'}
                              </CBadge>
                              {item.isPosted ? (
                                <CBadge color="success">Posted</CBadge>
                              ) : (
                                <CBadge color="danger">Not Posted</CBadge>
                              )}
                              {item.isDeleted && <CBadge color="danger">Deleted</CBadge>}
                            </div>
                            <div>
                              <p>
                                Expires at{' '}
                                <span className="text-info">
                                  {formatDate(item.expiresAt)}
                                </span>
                              </p>
                            </div>
                            <div>
                              <p>{item.content}</p>
                            </div>
                          </CCardBody>
                          <CCardFooter>
                            <CButtonGroup>
                              <CTooltip content="Delete" placement="top">
                                <CButton color="danger" onClick={() => deleteTrackerData(item._id)}>
                                  <FontAwesomeIcon icon={faTrash} />
                                </CButton>
                              </CTooltip>
                              <CTooltip content="Use as Template" placement="top">
                                <CButton
                                  color="info"
                                  onClick={() => editSummary(item, item.platform)}
                                >
                                  <FontAwesomeIcon icon={faPencil} />
                                </CButton>
                              </CTooltip>
                            </CButtonGroup>
                          </CCardFooter>
                        </CCard>
                      </CCol>
                    )
                  })}
                </CRow> */}
              </CContainer>
            </CCol>
          </CRow>
        </CContainer>
      )}
    </>
  )
}
export default Jobposter
