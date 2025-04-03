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

  const getAllJobs = async () => {
    try {
      setIsJobLoading(true)
      const res = await get('/job/all')
      console.log(res.data.data)
      if (res.status === 200) {
        setIsJobLoading(false)
        setJobs(res.data.data)
      }
      console.log(jobs)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllJobs()
  }, [])

  return (
    <>
      <CContainer>
        <CRow className="mb-3">
          <CCol>
            <h2>Jobs</h2>
            <small>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Et minima laboriosam quae
              beatae, tenetur tempore dignissimos voluptatum. Ea nam doloribus soluta rem. Quasi
              alias temporibus, error facere ad minima optio.
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
                <CButton color="primary" size="sm">
                  <FontAwesomeIcon icon={faRefresh} />
                </CButton>
              </CInputGroup>
            </CForm>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CCard>
              <CCardBody>
                <CTable align="middle" hover responsive striped>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Title</CTableHeaderCell>
                      <CTableHeaderCell>Capacity</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {isJobLoading ? (
                      <CTableRow>
                        <CTableDataCell colSpan="4">
                          <CSpinner size="sm" /> Loading...
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
                            <div className="d-flex flex-row gap-2">
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

                              {(userInformation.role === 'admin' ||
                                userInformation.role === 'manager' ||
                                userInformation.role === 'recruiter') && (
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
            <JobForm
              isVisible={isJobFormVisible}
              onClose={() => {
                setIsJobFormVisible(false)
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
