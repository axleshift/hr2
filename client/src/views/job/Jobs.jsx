import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CInputGroup,
  CFormInput,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CSpinner,
  CTooltip,
  CCard,
  CCardBody,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faL, faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons'
import React, { useContext, useEffect, useState } from 'react'
import { get } from '../../api/axios'
import { trimString } from '../../utils'

import AppPagination from '../../components/AppPagination'

import JobForm from './modals/JobForm'
import { AuthContext } from '../../context/authContext'

const JobPage = () => {
  const { userInformation } = useContext(AuthContext)

  const [jobs, setJobs] = useState([])
  const [isJobLoading, setIsJobLoading] = useState(false)

  // job form
  const [isJobFormVisible, setIsJobFormVisible] = useState(false)
  const [selectedJob, setSelectedJob] = useState({})
  const [jobFormState, setJobFormState] = useState('view')

  // search
  const [searchQuery, setSearchQuery] = useState('')

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  const getAllJobs = async (searchQuery) => {
    try {
      setIsJobLoading(true)
      const res = searchQuery
        ? await get(
            `/job/all?query=${searchQuery}&page=${currentPage}&limit=${itemsPerPage}&sort=desc`,
          )
        : await get(`/job/all?page=${currentPage}&limit=${itemsPerPage}&sort=desc`)
      console.log('Jobs all', JSON.stringify(res, null, 2))
      switch (res.status) {
        case 200:
          setIsJobLoading(false)
          setJobs(res.data.data)
          setCurrentPage(res.data.currentPage)
          setItemsPerPage(res.data.itemsPerPage)
          setTotalPages(res.data.totalPages)
          break
        case 404:
          setIsJobLoading(false)
          setJobs([])
          setCurrentPage(0)
          setItemsPerPage(0)
          setTotalPages(0)
          break
        default:
          throw new Error(`Unexpected status code: ${res.status}`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const DEBOUNCE_DELAY = 500
  useEffect(() => {
    const handler = setTimeout(() => {
      searchQuery ? getAllJobs(searchQuery) : getAllJobs()
    }, DEBOUNCE_DELAY)
    return () => clearTimeout(handler)
  }, [searchQuery, currentPage, totalPages, totalItems])

  return (
    <>
      <CContainer>
        <CRow className="mb-3">
          <CCol>
            <h2>Jobs</h2>
            <small>
              You can management job request in this page or make your own that can be used as base
              for jobposting.
            </small>
          </CCol>
        </CRow>
        <CRow>
          <CCol className="mb-3 d-flex justify-content-end">
            <CButton
              color="primary"
              size="sm"
              onClick={() => {
                setIsJobFormVisible(true)
                setJobFormState('create')
              }}
            >
              Create
            </CButton>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol>
            <CForm>
              <CInputGroup type="text" id="searchInput" name="searchInput" placeholder="Search...">
                <CFormInput />
                <CButton color="primary" size="sm">
                  <FontAwesomeIcon icon={faSearch} />
                </CButton>
                <CButton color="primary" size="sm" onClick={() => getAllJobs()}>
                  <FontAwesomeIcon icon={faRefresh} />
                </CButton>
              </CInputGroup>
            </CForm>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol>
            <CCard>
              <CCardBody>
                <CTable align="middle" hover responsive striped>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Title</CTableHeaderCell>
                      <CTableHeaderCell>Capacity</CTableHeaderCell>
                      <CTableHeaderCell>Author</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {isJobLoading ? (
                      <CTableRow>
                        <CTableDataCell colSpan="12">
                          <div className="d-flex justify-content-center">
                            <CSpinner size="sm" /> <span>Loading...</span>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ) : jobs.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="12">
                          <div className="d-flex justify-content-center">No Jobs found.</div>
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      jobs.map((job) => (
                        <CTableRow key={job._id}>
                          <CTooltip position="top" content={job._id}>
                            <CTableDataCell>{trimString(job._id, 10)}</CTableDataCell>
                          </CTooltip>
                          <CTableDataCell>{job.title}</CTableDataCell>
                          <CTableDataCell>{job.capacity}</CTableDataCell>
                          <CTableDataCell>
                            {typeof job.author === 'string'
                              ? job.author // If it's a string, display it as is
                              : job.author && job.author.firstname // If it's an object, display full name
                                ? `${job.author.firstname} ${job.author.lastname}`
                                : 'Unknown'}
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex flex-row gap-2">
                              <CButton
                                color="primary"
                                size="sm"
                                onClick={() => {
                                  setSelectedJob(job)
                                  setIsJobFormVisible(true)
                                  setJobFormState('edit')
                                }}
                              >
                                Edit
                              </CButton>

                              <CButton
                                color="primary"
                                size="sm"
                                onClick={() => {
                                  setSelectedJob(job)
                                  setIsJobFormVisible(true)
                                  setJobFormState('view')
                                }}
                              >
                                View
                              </CButton>
                              {['admin', 'manager', 'recruiter'].includes(userInformation.role) && (
                                <CButton
                                  color="warning"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedJob(job)
                                    setIsJobFormVisible(true)
                                    setJobFormState('edit')
                                  }}
                                >
                                  Manage
                                </CButton>
                              )}
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
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
        <CRow>
          <CCol>
            <JobForm
              isVisible={isJobFormVisible}
              onClose={() => {
                setIsJobFormVisible(false)
                getAllJobs()
              }}
              state={jobFormState}
              job={selectedJob}
            />
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default JobPage
