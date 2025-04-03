import React, { useEffect, useState } from 'react'
import propTypes from 'prop-types'

import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CContainer,
  CRow,
  CCol,
  CInputGroup,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CButton,
  CFormRange,
  CFormFeedback,
  CSpinner,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CTableFoot,
  CCardHeader,
  CCard,
  CCardBody,
  CCardFooter,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTabs,
  CListGroup,
  CListGroupItem,
  CTooltip,
} from '@coreui/react'

import AppPagination from '../../../components/AppPagination'
import { get } from '../../../api/axios'
import { formatDate, formatTime } from '../../../utils'

const EventTab = ({ applicantId }) => {
  const [events, setEvents] = useState([])
  const [isEventLoading, setIsEventLoading] = useState(false)

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  const getHeaderColor = (index) => {
    return index % 2 === 0 ? '' : '#6c757d' // Blue for primary, Gray for secondary
  }

  const getColor = (index) => {
    return index % 2 === 0 ? '' : 'white'
  }

  const getApplicantEvents = async (appId) => {
    try {
      setIsEventLoading(true)
      const res = await get(`/applicant/events/${appId}`)
      console.log('Events', JSON.stringify(res.data, null, 2))
      setEvents(res.data.data)
      setCurrentPage(res.data.currentPage)
      setTotalItems(res.data.totalItems)
      setTotalPages(res.data.totalPages)
    } catch (error) {
      console.error(error)
    } finally {
      setIsEventLoading(false)
    }
  }

  useEffect(() => {
    console.log(applicantId)
    if (applicantId) {
      getApplicantEvents(applicantId)
    }
  }, [applicantId])
  return (
    <>
      <CContainer className="mt-3 mb-3">
        <CRow className="mb-3">
          <CCol className="d-flex justify-content-end">
            <CButton
              color="primary"
              size="sm"
              onClick={() => getApplicantEvents(applicantId)}
              disabled={isEventLoading}
              className="w-25"
            >
              {isEventLoading ? (
                <>
                  <CSpinner size="sm" />
                  <span>Loading...</span>
                </>
              ) : (
                'Refresh'
              )}
            </CButton>
          </CCol>
        </CRow>
        {events.length === 0 ? (
          <CRow>
            <CCol>No Events found</CCol>
          </CRow>
        ) : (
          events.map((event, index) => {
            return (
              <CRow key={event._id} className="mb-3">
                <CCol>
                  <CCard>
                    <CCardHeader
                      style={{ backgroundColor: getHeaderColor(index), color: getColor(index) }}
                    >
                      {event.name}
                    </CCardHeader>
                    <CCardBody>
                      <CForm>
                        <CRow>
                          <CCol>
                            <h5>Event Information</h5>
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput label="Name" value={event.name} />
                          </CCol>
                          <CCol>
                            <CFormInput
                              label="Author"
                              value={`${event.author.lastname}, ${event.author.firstname}`}
                            />
                          </CCol>
                          <CCol>
                            <CFormInput label="Role" value={event.author.role} />
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput label="Event Type" value={event.type} />
                          </CCol>
                          <CCol>
                            <CFormInput
                              label="Date"
                              value={formatDate(event.date, 'MMM DD YYYY h:mm A')}
                            />
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormTextarea label="Description" value={event.description} />
                          </CCol>
                        </CRow>
                        <CRow>
                          <CCol>
                            <CFormLabel>Timeslot</CFormLabel>
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput label="Start" value={formatTime(event.timeslot.start)} />
                          </CCol>
                          <CCol>
                            <CFormInput label="End" value={formatTime(event.timeslot.end)} />
                          </CCol>
                          <CCol>
                            <CFormInput label="Email Sent" value={event.emailSent.status} />
                          </CCol>
                        </CRow>
                        <hr />
                        <CRow>
                          <CCol>
                            <h5>Facility</h5>
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput label="Name" value={event.facility.name} />
                          </CCol>
                          <CCol>
                            <CFormInput label="Type" value={event.facility.type} />
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol>
                            <CFormTextarea label="Location" value={event.facility.location} />
                          </CCol>
                        </CRow>
                      </CForm>
                    </CCardBody>
                    <CCardFooter className="d-flex justify-content-end">
                      <div className="d-flex gap-2 flex-row text-muted">
                        <small style={{ fontSize: '0.8rem' }}>
                          Created At:{' '}
                          <span>{formatDate(event.createdAt, 'MMM DD YYYY h:mm A')}</span>
                        </small>
                        <small> | </small>
                        <small style={{ fontSize: '0.8rem' }}>
                          Updated At:{' '}
                          <span>{formatDate(event.updatedAt, 'MMM DD YYYY h:mm A')}</span>
                        </small>
                      </div>
                    </CCardFooter>
                  </CCard>
                </CCol>
              </CRow>
            )
          })
        )}
        <CRow className="mt-2">
          <CCol>
            <div className="d-flex flex-row gap-2 justify-content-center align-items-center">
              <AppPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

EventTab.propTypes = {
  applicantId: propTypes.string,
}

export default EventTab
