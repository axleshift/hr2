import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CModalTitle,
  CButton,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CFormTextarea,
  CFormCheck,
  CFormFeedback,
  CContainer,
  CRow,
  CCol,
  CTooltip,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CFormLabel,
  CBadge,
} from '@coreui/react'
import Calendar from 'react-calendar'
import TimeModal from './TimeForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faClock,
  faPenClip,
  faPlus,
  faCheck,
  faXmark,
  faTrash,
  faListNumeric,
} from '@fortawesome/free-solid-svg-icons'

import { del, get, post, put } from '../../../api/axios'

import React, { useEffect, useState, useCallback } from 'react'
import propTypes, { bool, object } from 'prop-types'
import { date, set, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formattedDateMMM, UTCDate } from '../../../utils'
const ApplicantForm = ({ isVisible, onClose, isDarkMode, applicantData }) => {
  const [formData, setFormData] = useState({})
  const [isDateLoading, setIsDateLoading] = useState(false)
  const [defaultDate, setDefaultDate] = useState(UTCDate(new Date()))
  const [interviewDatas, setInterviewDatas] = useState([])
  const [allSlots, setAllSlots] = useState([])

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const handleDateChange = (date) => {
    setDefaultDate(date)
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
      // setDateTimeSlotData(res.data.slots)
      setTotalPages(res.data.totalPages)
      setIsDateLoading(false)
    } catch (error) {
      console.error(error)
      setIsDateLoading(false)
    }
  })

  useEffect(() => {
    getAllData(defaultDate)
  }, [defaultDate, currentPage, itemsPerPage])

  useEffect(() => {
    if (applicantData) {
      setFormData(applicantData)
    }
  }, [applicantData])
  return (
    <CModal visible={isVisible} onClose={onClose} size="lg">
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
                value={formattedDateMMM(defaultDate)}
                readOnly
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <strong>
                Time Slots
              </strong>
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
