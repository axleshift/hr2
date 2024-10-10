import {
  CContainer,
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CBadge,
} from '@coreui/react'
import propTypes from 'prop-types'
import { faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useEffect } from 'react'
import { get } from '../../api/axios'

const CreateInterview = ({ theme }) => {
  const isDarkMode = theme === 'dark'
  const [tagLoading, setTagLoading] = useState(false)
  const [formTags, setFormTags] = useState([])
  const [applicantsData, setApplicantsData] = useState([])
  const [applicantData, setApplicantData] = useState({})
  const [formModal, setFormModal] = useState(false)

  const getAllData = async () => {
    try {
      const res = await get('/applicant/all')
      setApplicantsData(res.data.data)
      console.log(applicantsData)
    } catch (error) {
      console.error(error)
    }
  }

  const getApplicant = async (id) => {
    try {
      setFormModal(true)
      const applicant = applicantsData.find((applicant) => applicant._id === id)
      setApplicantData(applicant)
    } catch (error) {
      console.error(error)
    }
  }

  const getAllTagOptions = async () => {
    try {
      setTagLoading(true)
      const category = 'applicant'
      const res = await get(`/tags/category/${category}`)
      if (res.status === 200) {
        setFormTags(res.data.data)
        setTagLoading(false)
      } else {
        console.log('Failed')
        setTagLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getTagData = (tagId) => {
    const tagData = formTags.find((tag) => tag._id === tagId)
    return tagData
  }

  const onTimeChange = (time) => {
    setTimeValue(time)
  }

  useEffect(() => {
    getAllData()
    getAllTagOptions()
  }, [])
  return (
    <>
      <CContainer>
        <CRow>
          <CContainer>
            <CCard>
              <CCardHeader>Applicants</CCardHeader>
              <CCardBody>
                <CTable align="middle" hover responsive striped>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>
                        <FontAwesomeIcon icon={faUser} />
                      </CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>Phone</CTableHeaderCell>
                      <CTableHeaderCell>Tags</CTableHeaderCell>
                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {applicantsData.map((applicant) => (
                      <CTableRow key={applicant._id}>
                        <CTableDataCell>
                          <div>
                            {applicant.lastname}, {applicant.firstname}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{applicant.email}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{applicant.phone}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-2">
                            {applicant.tags.map((tag, index) => {
                              return (
                                <CBadge key={index} color="primary">
                                  {/* // get tag name from formtags */}
                                  {formTags.find((item) => item._id === tag) &&
                                    formTags.find((item) => item._id === tag).name}
                                </CBadge>
                              )
                            })}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            onClick={() => getApplicant(applicant._id)}
                            className="btn btn-primary"
                            size="sm"
                          >
                            <FontAwesomeIcon icon={faCalendarAlt} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CContainer>
        </CRow>
        <CRow></CRow>
      </CContainer>
    </>
  )
}

CreateInterview.propTypes = {
  theme: propTypes.string,
}

export default CreateInterview
