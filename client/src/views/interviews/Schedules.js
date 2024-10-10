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
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Calendar } from 'react-calendar'
import ScheduleForm from './modals/ScheduleForm'
import React, { useEffect, useState } from 'react'
import propTypes from 'prop-types'
import { formattedDateMMM, formatTime, randomDate, randomTime, trimString } from '../../utils'
import { get } from '../../api/axios'

const Schedules = ({ theme }) => {
  const isDarkMode = theme === 'dark'
  const [isDateRange, setIsDateRange] = useState(false)
  const [dateRange, setDateRange] = useState([new Date(), new Date()])
  const [defaultDate, setDefaultDate] = useState(new Date())

  //
  const [dateData, setDateData] = useState(new Date())
  const [isDateLoading, setIsDateLoading] = useState(false)

  // Modal Forms
  const [formModal, setFormModal] = useState(false)

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalPages, setTotalPages] = useState(1)

  const [interviewData, setInterviewData] = useState([])

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

  const getAllData = async (date) => {
    setIsDateLoading(true)
    try {
      const res = await get(`/interview/all?date=${date}&page=${currentPage}&limit=${itemsPerPage}`)
      if (res.status === 404) {
        setInterviewData([])
        setIsDateLoading(false)
        return
      }

      console.log(res.data.data)

      setInterviewData(res.data.data)
      setTotalPages(res.data.totalPages)
      setIsDateLoading(false)
    } catch (error) {
      console.error(error)
      setIsDateLoading(false)
    }
  }

  const getTimeData = async (id) => {
    try {
      const res = await get(`/interview/slot/${id}`)
      console.log(res.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  const getAllSlotData = async () => {
    try {
      const res = await get('/interview/slot/all')
      console.log(res.data.data)
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
                <CTable align="middle" hover responsive striped>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>
                        <FontAwesomeIcon icon={faBars} />
                      </CTableHeaderCell>
                      <CTableHeaderCell>Date</CTableHeaderCell>
                      <CTableHeaderCell>Time</CTableHeaderCell>
                      <CTableHeaderCell>Location</CTableHeaderCell>
                      <CTableHeaderCell>Additional Info</CTableHeaderCell>
                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {interviewData.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="5" className="text-center">
                          No data available
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      interviewData.map((data, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{data.title}</CTableDataCell>
                          <CTableDataCell>{formattedDateMMM(data.date)}</CTableDataCell>
                          <CTableDataCell>
                            <CButton onClick={() => getTimeData(data.timeslotRef_id)}>
                              <FontAwesomeIcon icon={faCalendarDay} />
                            </CButton>
                          </CTableDataCell>
                          <CTableDataCell>
                            {data.location ? trimString(data.location, 20) : 'N/A'}
                          </CTableDataCell>
                          <CTableDataCell>
                            {data.additionalInfo ? trimString(data.additionalInfo, 20) : 'N/A'}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton color="primary" className="btn btn-primary">
                              <FontAwesomeIcon icon={faUser} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))
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
              </CCardBody>
            </CCard>
          </CContainer>
        </CRow>
        <CRow>
          <ScheduleForm
            isVisible={formModal}
            onClose={() => setFormModal(false)}
            isDarkMode={isDarkMode}
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
