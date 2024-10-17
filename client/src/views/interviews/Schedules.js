import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CButton,
  CTooltip,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
} from '@coreui/react'

import AppPagination from '../../components/AppPagination'

import {
  faCalendarAlt,
  faCalendarDays,
  faCalendarDay,
  faUser,
  faPlus,
  faBars,
  faPencil,
  faSearch,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Calendar } from 'react-calendar'
import ScheduleForm from './modals/ScheduleForm'
import React, { useEffect, useState, useCallback } from 'react'
import propTypes from 'prop-types'
import {
  convertTimeStringTo12Hour,
  formattedDateMMM,
  formatTime,
  randomDate,
  randomTime,
  trimString,
} from '../../utils'
import { get } from '../../api/axios'

const Schedules = ({ theme }) => {
  const isDarkMode = theme === 'dark'
  const [isDateRange, setIsDateRange] = useState(false)
  const [dateRange, setDateRange] = useState([new Date(), new Date()])
  const [defaultDate, setDefaultDate] = useState(new Date())

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
      if (res.status === 404) {
        setInterviewDatas([])
        setIsDateLoading(false)
        return
      }
      console.log(res.data)
      setInterviewDatas(res.data.data)
      setDateTimeSlotData(res.data.slots)
      setTotalPages(res.data.totalPages)
      setIsDateLoading(false)
    } catch (error) {
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
                      value={formattedDateMMM(defaultDate)}
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
                      <CTableHeaderCell>
                        <FontAwesomeIcon icon={faBars} />
                      </CTableHeaderCell>
                      <CTableHeaderCell>Date</CTableHeaderCell>
                      <CTableHeaderCell>Time</CTableHeaderCell>
                      <CTableHeaderCell>Location</CTableHeaderCell>
                      <CTableHeaderCell>Capacity</CTableHeaderCell>
                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {interviewDatas.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="5" className="text-center">
                          No data available
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      interviewDatas.map((data, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{data.title}</CTableDataCell>
                          <CTableDataCell>{formattedDateMMM(data.date)}</CTableDataCell>
                          <CTableDataCell>
                            {convertTimeStringTo12Hour(data.timeslot.start)} -{' '}
                            {convertTimeStringTo12Hour(data.timeslot.end)}
                          </CTableDataCell>
                          <CTableDataCell>
                            {data.location ? trimString(data.location, 20) : 'N/A'}
                          </CTableDataCell>
                          <CTableDataCell>
                            {data.capacity ? trimString(data.capacity, 20) : 'N/A'}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              onClick={() => {
                                console.log('Interview Data:', data)
                                setInterviewData(data)
                                setFormModal(true)
                              }}
                              className="btn btn-primary"
                            >
                              <FontAwesomeIcon icon={faPencil} />
                            </CButton>
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
