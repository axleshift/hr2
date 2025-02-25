import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CContainer,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CSpinner,
  CTab,
  CTabs,
  CTabList,
  CTabContent,
  CTabPanel,
  CForm,
  CFormInput,
  CInputGroup,
  CButton,
  CTooltip,
} from '@coreui/react'
import Calendar from 'react-calendar'

import { get } from '../../../api/axios'

import React, { useEffect, useState } from 'react'
import propTypes from 'prop-types'
import { formatDate, UTCDate, convertTimeStringTo12Hour } from '../../../utils'
import { trimString } from './../../../utils/index'
import AppPagination from './../../../components/AppPagination'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { AppContext } from '../../../context/appContext'

const ApplicantForm = ({ isVisible, onClose, isDarkMode, applicantData }) => {
  const { addToast } = React.useContext(AppContext)

  const [formData, setFormData] = useState({})
  const [isDateLoading, setIsDateLoading] = useState(false)
  const [defaultDate, setDefaultDate] = useState(UTCDate(new Date()))
  const [interviewDatas, setInterviewDatas] = useState([])
  const [allSlots, setAllSlots] = useState([])
  const [collapseState, setCollapseState] = useState([])
  const [addedEvents, setAddedEvents] = useState([])

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const handleDateChange = (date) => {
    setDefaultDate(date)
  }

  // NOTE: Sometimes this don't work properly, idk why yet
  // TODO: Fix this, it should sort the data by date, then by time
  const sortByDateThenByTime = (data) => {
    return data.sort((a, b) => {
      // Compare the dates
      const dateComparison = new Date(a.date) - new Date(b.date)
      if (dateComparison !== 0) return dateComparison

      // If dates are equal, compare the times (timeslot.start)
      const timeA = a.timeslot.start.split(':').map(Number)
      const timeB = b.timeslot.start.split(':').map(Number)
      const timeComparison = timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1])

      return timeComparison
    })
  }

  const getAllData = async (date) => {
    setIsDateLoading(true)
    try {
      const res = await get(`/interview/all?date=${date}&page=${currentPage}&limit=${itemsPerPage}`)
      if (res.status === 200) {
        const sortedData = sortByDateThenByTime(res.data.data)
        setInterviewDatas(sortedData)
        setCollapseState(new Array(res.data.data.length).fill(false))
        // setDateTimeSlotData(res.data.slots)
        setCurrentPage(res.data.currentPage)
        setTotalPages(res.data.totalPages)
        setIsDateLoading(false)
      } else {
        setIsDateLoading(false)
        addToast('Calendar | Scheduling Form', res.message.message, 'danger')
      }

    } catch (error) {
      console.error(error)
      setIsDateLoading(false)
    }
  }

  const handleAddEvent = async (event) => {
    try {
      // check if the event is already added
      if (addedEvents.find((item) => item._id === event._id)) {
        // addToast('Info', 'Event already added', 'warning')
        return
      }
      // sort it by date, then by start time
      const sortedEvents = sortByDateThenByTime([...addedEvents, event])
      setAddedEvents(sortedEvents)
      // addToast('Info', 'Event Added', 'success')
    } catch (error) {
      console.error(error)
    }
  }

  const handleRemoveEvent = async (event) => {
    try {
      setAddedEvents((prev) => prev.filter((item) => item._id !== event._id))
      // addToast('Info', 'Event Removed', 'success')
    } catch (error) {
      console.error(error)
    }
  }

  const handleToggleCollapse = (index) => {
    setCollapseState((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  useEffect(() => {
    getAllData(defaultDate)
  }, [defaultDate, currentPage, itemsPerPage])

  useEffect(() => {
    if (applicantData) {
      setFormData(applicantData)
    }
  }, [applicantData])

  return (
    <CModal
      visible={isVisible}
      onClose={() => {
        onClose()
        setDefaultDate(UTCDate(new Date()))
        setAddedEvents([])
      }}
      size="xl"
    >
      <CModalHeader>
        <CModalTitle>
          <div>
            Schedule Interview for{' '}
            <span className="fw-bold">
              {applicantData?.lastname}, {applicantData?.firstname}
            </span>
          </div>
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CContainer>
          <CRow className="mb-3">
            <CCol>
              <div>
                <Calendar
                  onChange={handleDateChange} // Fix here
                  defaultValue={defaultDate}
                  className={isDarkMode ? 'calendar dark-mode' : 'calendar'}
                />
              </div>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CFormInput
                type="text"
                id="date"
                name="date"
                placeholder="Date"
                value={formatDate(defaultDate)}
                readOnly
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <h2>Events</h2>
              <small>
                Pick an event to schedule an interview for{' '}
                <span className="text-info">
                  {applicantData?.lastname}, {applicantData?.firstname}
                </span>
              </small>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CTabs activeItemKey="events">
                <CTabList variant="underline-border">
                  <CTab itemKey="events">Events</CTab>
                  <CTab itemKey="applicant">Applicant&lsquo;s Events</CTab>
                </CTabList>
                <CTabContent>
                  <CTabPanel itemKey="events">
                    <div className="my-3">
                      <CForm>
                        <CInputGroup>
                          <CFormInput type="text" id="search" name="search" placeholder="Search" />
                          <CTooltip content="Search for events" placement="top">
                            <CButton color="primary">
                              <FontAwesomeIcon icon={faSearch} />
                            </CButton>
                          </CTooltip>
                        </CInputGroup>
                      </CForm>
                    </div>
                    <CTable align="middle" responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell className="text-center">#</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Title</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Capacity</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Participants</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Timeslot</CTableHeaderCell>
                          {/* <CTableHeaderCell className="text-center">Location</CTableHeaderCell> */}
                          <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {isDateLoading ? (
                          <CTableRow>
                            <CTableDataCell colSpan="7" className="text-center">
                              <CSpinner color="primary" variant="grow" />
                            </CTableDataCell>
                          </CTableRow>
                        ) : interviewDatas.length === 0 ? (
                          <CTableRow>
                            <CTableDataCell colSpan="7" className="text-center">
                              No data found
                            </CTableDataCell>
                          </CTableRow>
                        ) : (
                          interviewDatas.map((data, index) =>
                            data.participants.includes(applicantData._id) ? null : (
                              <React.Fragment key={data._id}>
                                <CTableRow>
                                  <CTableDataCell className="text-center">
                                    {trimString(data._id, 3)}
                                  </CTableDataCell>
                                  <CTableDataCell className="text-center">
                                    {data.title}
                                  </CTableDataCell>
                                  <CTableDataCell className="text-center">
                                    {data.capacity}
                                  </CTableDataCell>
                                  <CTableDataCell className="text-center">
                                    {data.participants.length}
                                  </CTableDataCell>
                                  <CTableDataCell className="text-center">
                                    <small>
                                      {convertTimeStringTo12Hour(data.timeslot.start)} -{' '}
                                      {convertTimeStringTo12Hour(data.timeslot.end)}
                                    </small>
                                  </CTableDataCell>
                                  {/* <CTableDataCell className="text-center">
                                    {data.location}
                                  </CTableDataCell> */}
                                  <CTableDataCell className="text-center">
                                    <CInputGroup>
                                      <CButton
                                        color="primary"
                                        size="sm"
                                        disabled={
                                          data.participants.length >= data.capacity ||
                                          data.participants.includes(applicantData._id) ||
                                          !!addedEvents.find((item) => item._id === data._id)
                                        }
                                        onClick={() => handleAddEvent(data)}
                                      >
                                        {data.participants.length >= data.capacity
                                          ? 'Full'
                                          : data.participants.includes(applicantData._id) ||
                                              !!addedEvents.find((item) => item._id === data._id)
                                            ? 'Added'
                                            : 'Add'}
                                      </CButton>
                                      <CButton
                                        color="info"
                                        size="sm"
                                        onClick={() => handleToggleCollapse(index)}
                                      >
                                        {collapseState[index] ? 'Hide' : 'Show'}
                                      </CButton>
                                    </CInputGroup>
                                  </CTableDataCell>
                                </CTableRow>
                                {collapseState[index] && (
                                  <CTableRow>
                                    <CTableDataCell colSpan="7">
                                      {/* <CCollapse visible={collapseState[index]}> */}
                                      <h6>Addditional Information</h6>
                                      <p>{data.additionalInfo}</p>

                                      <h6>Location</h6>
                                      <p>{data.location}</p>
                                      {/* </CCollapse> */}
                                    </CTableDataCell>
                                  </CTableRow>
                                )}
                              </React.Fragment>
                            ),
                          )
                        )}
                      </CTableBody>
                    </CTable>
                    <div className="d-flex justify-content-center align-items-center">
                      <AppPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  </CTabPanel>
                  <CTabPanel itemKey="applicant">
                    <CTable align="middle" responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell className="text-center">#</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Title</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Date</CTableHeaderCell>
                          <CTableHeaderCell className="text-center">Timeslot</CTableHeaderCell>
                          {/* <CTableHeaderCell className="text-center">Location</CTableHeaderCell> */}
                          <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {isDateLoading ? (
                          <CTableRow>
                            <CTableDataCell colSpan="7" className="text-center">
                              <CSpinner color="primary" variant="grow" />
                            </CTableDataCell>
                          </CTableRow>
                        ) : addedEvents.length === 0 ? (
                          <CTableRow>
                            <CTableDataCell colSpan="7" className="text-center">
                              No data found
                            </CTableDataCell>
                          </CTableRow>
                        ) : (
                          addedEvents.map((data, index) =>
                            // if user is already in the participants list, do not show the event
                            data.participants.includes(applicantData._id) ? null : (
                              <React.Fragment key={data._id}>
                                <CTableRow>
                                  <CTableDataCell className="text-center">
                                    {trimString(data._id, 3)}
                                  </CTableDataCell>
                                  <CTableDataCell className="text-center">
                                    {data.title}
                                  </CTableDataCell>
                                  <CTableDataCell className="text-center">
                                    {formatDate(data.date, 'MMMM DD, YYYY')}
                                  </CTableDataCell>
                                  <CTableDataCell className="text-center">
                                    <small>
                                      {convertTimeStringTo12Hour(data.timeslot.start)} -{' '}
                                      {convertTimeStringTo12Hour(data.timeslot.end)}
                                    </small>
                                  </CTableDataCell>
                                  {/* <CTableDataCell className="text-center">
                                    {data.location}
                                  </CTableDataCell> */}
                                  <CTableDataCell className="text-center">
                                    <CInputGroup>
                                      <CButton
                                        color="danger"
                                        size="sm"
                                        disabled={data.participants.length >= data.capacity}
                                        onClick={() => handleRemoveEvent(data)}
                                      >
                                        Remove
                                      </CButton>
                                      <CButton
                                        color="info"
                                        size="sm"
                                        onClick={() => handleToggleCollapse(index)}
                                      >
                                        {collapseState[index] ? 'Hide' : 'Show'}
                                      </CButton>
                                    </CInputGroup>
                                  </CTableDataCell>
                                </CTableRow>
                                {collapseState[index] && (
                                  <CTableRow>
                                    <CTableDataCell colSpan="7">
                                      {/* <CCollapse visible={collapseState[index]}> */}
                                      <h6>Addditional Information</h6>
                                      <p>{data.additionalInfo}</p>

                                      <h6>Location</h6>
                                      <p>{data.location}</p>
                                      {/* </CCollapse> */}
                                    </CTableDataCell>
                                  </CTableRow>
                                )}
                              </React.Fragment>
                            ),
                          )
                        )}
                      </CTableBody>
                    </CTable>
                    <div>
                      <small>
                        <span className="text-danger">Note:</span> Events added here will be
                        scheduled for the applicant once the form is submitted.
                      </small>
                      <br />
                      <small>
                        <span className="text-danger">Warning:</span> Once closed, the events will
                        be resetted. Make sure to submit the form before closing.
                      </small>
                    </div>
                    <div className="d-flex justify-content-end">
                      <CButton className="btn btn-primary">Submit</CButton>
                    </div>
                  </CTabPanel>
                </CTabContent>
              </CTabs>
            </CCol>
          </CRow>
        </CContainer>
      </CModalBody>
    </CModal>
  )
}
ApplicantForm.propTypes = {
  isVisible: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
  isDarkMode: propTypes.bool.isRequired,
  applicantData: propTypes.object,
}

export default ApplicantForm
