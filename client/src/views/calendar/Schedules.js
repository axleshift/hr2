import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CInputGroup,
  CButton,
  CTooltip,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CButtonGroup,
  CSpinner,
} from '@coreui/react'
import AppPagination from '../../components/AppPagination'
import { faPlus, faBars, faPencil, faSearch, faTrash, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Calendar } from 'react-calendar'
import ScheduleForm from './modals/ScheduleForm'
import React, { useEffect, useState, useCallback, useContext } from 'react'
import propTypes from 'prop-types'
import { convertTimeStringTo12Hour, formatDate, trimString, UTCDate } from '../../utils'
import { get, del } from '../../api/axios'
import { AppContext } from '../../context/appContext'

const Schedules = ({ theme }) => {
  const isDarkMode = theme === 'dark'
  const { addToast } = useContext(AppContext)
  const [isDateRange, setIsDateRange] = useState(false)
  const [dateRange, setDateRange] = useState([new Date(), new Date()])
  const [defaultDate, setDefaultDate] = useState(UTCDate(new Date()))

  //
  const [dateData, setDateData] = useState(new Date())
  const [dateTimeSlotData, setDateTimeSlotData] = useState([])
  const [isDateLoading, setIsDateLoading] = useState(false)

  // Modal Forms
  const [formModal, setFormModal] = useState(false)

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalPages, setTotalPages] = useState(1)

  const [interviewDatas, setInterviewDatas] = useState([])
  const [interviewData, setInterviewData] = useState(null)

  const onChange = (newValue) => {
    if (newValue.length > 1) {
      setDateRange(newValue)
    } else {
      setDefaultDate(newValue)
    }
  }

  const resetDateRange = () => {
    setDateRange([new Date(), new Date()])
    setDefaultDate(new Date())
  }

  const getAllData = useCallback(async (date) => {
    setIsDateLoading(true)
    try {
      const res = await get(`/interview/all?date=${date}&page=${currentPage}&limit=${itemsPerPage}`)
      if (res.status === 200) {
        // const txt = `Successfully fetched interview schedules for ${formattedDateMMM(date)}`
        // addToast('Success', txt, 'success')
        setInterviewDatas(res.data.data)
        setDateTimeSlotData(res.data.slots)
        setTotalPages(res.data.totalPages)
        setIsDateLoading(false)
      } else {
        // const txt = `Failed to fetch interview schedules for ${formattedDateMMM(date)}`
        // addToast('Warning', txt, 'warning')
        setIsDateLoading(false)
        setInterviewDatas([])
        setDateTimeSlotData([])
      }
    } catch (error) {
      const txt = `Failed to fetch interview schedules for ${formatDate(date)}`
      addToast('Error', txt, 'error')
      console.error(error)
      setIsDateLoading(false)
    }
  })

  const getTimeData = async (id) => {
    try {
      const res = dateTimeSlotData.filter((data) => data.id === id)
      console.log(res)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await del(`/interview/schedule/${id}`)
      if (res.status === 200) {
        addToast('Success', 'Successfully deleted interview schedule', 'success')
        getAllData(defaultDate)
      } else {
        addToast('Error', 'Failed to delete interview schedule', 'error')
      }
    } catch (error) {
      console.error(error)
      addToast('Error', 'Failed to delete interview schedule', 'error')
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getAllData(defaultDate)
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [defaultDate])

  useEffect(() => {
    if (formModal && interviewData) {
      setFormModal(false)
    }
  }, [currentPage])

  return (
    <>
      <CContainer className="d-flex flex-column gap-3">
        <CRow>
          <CCol>
            <h2>Schedules</h2>
            <small>
              In this page, you can create and edit schedules for interviews, task, or any other
              events.
            </small>
          </CCol>
        </CRow>
        <CRow>
          <CContainer>
            <CCard>
              <CCardBody>
                <div>
                  <Calendar
                    onChange={onChange}
                    selectRange={isDateRange}
                    className={isDarkMode ? 'calendar dark-mode' : 'calendar'}
                    defaultValue={
                      isDateRange
                        ? [new Date(dateRange[0]), new Date(dateRange[1])]
                        : new Date(defaultDate)
                    }
                  />
                </div>
                <br />
                <div>
                  <CInputGroup>
                    <CFormInput
                      type="text"
                      placeholder="start"
                      value={formatDate(defaultDate)}
                      readOnly
                    />
                    <CTooltip content="Create interview" placement="top">
                      <CButton onClick={() => setFormModal(true)} className="btn btn-primary">
                        <FontAwesomeIcon icon={faPlus} />
                      </CButton>
                    </CTooltip>
                  </CInputGroup>
                </div>
              </CCardBody>
            </CCard>
          </CContainer>
        </CRow>
        <CRow>
          <CContainer>
            <CCard>
              <CCardBody>
                <CForm>
                  <CInputGroup>
                    <CFormInput type="text" placeholder="Search" />
                    <CButton color="primary">
                      <FontAwesomeIcon icon={faSearch} />
                    </CButton>
                  </CInputGroup>
                </CForm>

                <CTable align="middle" hover responsive striped>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell className="text-center">
                        <FontAwesomeIcon icon={faBars} />
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Date</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Time</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Location</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Capacity</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {isDateLoading ? (
                      <CTableRow>
                        <CTableDataCell colSpan="6" className="text-center">
                          <CSpinner color="primary" variant="grow" />
                        </CTableDataCell>
                      </CTableRow>
                    ) : interviewDatas.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="6" className="text-center">
                          No data available for{' '}
                          <span className="text-info">{formatDate(defaultDate)}</span>
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      interviewDatas.map((data, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell className="text-center">{data.title}</CTableDataCell>
                          <CTableDataCell className="text-center">
                            {formatDate(data.date)}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {convertTimeStringTo12Hour(data.timeslot.start)} -{' '}
                            {convertTimeStringTo12Hour(data.timeslot.end)}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {data.location ? trimString(data.location, 20) : 'N/A'}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            {data.capacity ? trimString(data.capacity, 20) : 'N/A'}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <CButtonGroup>
                              <CButton
                                onClick={() => {
                                  console.log('Interview Data:', data)
                                  setInterviewData(data)
                                  setFormModal(true)
                                }}
                                className="btn btn-primary"
                              >
                                <CTooltip content="Edit" placement="top">
                                  <FontAwesomeIcon icon={faPencil} />
                                </CTooltip>{' '}
                              </CButton>
                              <CButton
                                onClick={() => handleDelete(data._id)}
                                className="btn btn-danger"
                              >
                                <CTooltip content="Delete" placement="top">
                                  <FontAwesomeIcon icon={faTrash} />
                                </CTooltip>{' '}
                              </CButton>
                              <CButton className="btn btn-warning">
                                <CTooltip content="Cancel" placement="top">
                                  <FontAwesomeIcon icon={faX} />
                                </CTooltip>
                              </CButton>
                            </CButtonGroup>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CContainer>
        </CRow>
        <CRow>
          <CCol>
            <div className="d-flex justify-content-center align-items-center">
              <AppPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </CCol>
        </CRow>
        <CRow>
          <ScheduleForm
            isVisible={formModal}
            onClose={() => setFormModal(false)}
            isDarkMode={isDarkMode}
            interviewData={interviewData}
          />
        </CRow>
      </CContainer>
    </>
  )
}

Schedules.propTypes = {
  theme: propTypes.string,
}

export default Schedules
