/* eslint-disable prettier/prettier */
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CBadge,
  CForm,
  CFormInput,
  CInputGroup,
  CTooltip,
  CFormFeedback,
  CSpinner,
} from '@coreui/react'
import propTypes from 'prop-types'
import {
  faCalendarAlt,
  faUser,
  faSearch,
  faXmark,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useEffect, useContext } from 'react'
import { get } from '../../api/axios'
import AppPagination from '../../components/AppPagination'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AppContext } from '../../context/appContext'
import ApplicantForm from './modals/ApplicantForm'

const Applicants = ({ theme }) => {
  const isDarkMode = theme === 'dark'
  const { addToast } = useContext(AppContext)
  const [tagLoading, setTagLoading] = useState(false)
  const [formTags, setFormTags] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [applicantsData, setApplicantsData] = useState([])
  const [applicantData, setApplicantData] = useState({})
  const [formModal, setFormModal] = useState(false)

  // search
  const [selectedTags, setSelectedTags] = useState([])
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalPages, setTotalPages] = useState(1)

  const getAllData = async (page, limit, term) => {
    try {
      setIsLoading(true)
      let tagsParams = ''
      if (selectedTags.length > 0) {
        tagsParams = selectedTags.map((tag) => `${tag}`).join(',')
      }
      const res = !isSearchMode
        ? await get('/applicant/all')
        : await get(
            `/applicant/search?query=${term}&page=${page}&limit=${limit}&tags=${tagsParams}`,
          )

      if (res.status === 200) {
        console.log(res.data.data)
        setApplicantsData(res.data.data)
        setTotalPages(res.data.totalPages)
        setIsLoading(false)
      } else {
        addToast('Error', 'Failed to fetch data', 'danger')
        setIsLoading(false)
      }
    } catch (error) {
      addToast('Error', 'Failed to fetch data', 'danger')
    }
  }

  const getApplicant = async (id) => {
    try {
      setFormModal(true)
      const applicant = applicantsData.find((applicant) => applicant._id === id)
      setApplicantData(applicant)
    } catch (error) {
      addToast('Error', 'Failed to fetch data', 'danger')
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
        addToast('Error', 'Failed to fetch data', 'danger')
        setTagLoading(false)
      }
    } catch (error) {
      addToast('Error', 'Failed to fetch data', 'danger')
    }
  }

  const selectedTagHandler = (tag) => {
    const isSelected = selectedTags.includes(tag)
    // check if the tag is already selected, if not, add it to the selectedTags array else remove it
    if (isSelected) {
      const updatedTags = selectedTags.filter((selectedTag) => selectedTag !== tag)
      setSelectedTags(updatedTags)
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const searchSchema = z.object({
    searchTerm: z.string().min(1, 'Search term is required'),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: async (data, context, options) => {
      const result = await zodResolver(searchSchema)(data, context, options)
      console.log('Validation result:', result)
      return result
    },
  })

  const handleSearch = (data) => {
    const { searchTerm } = data
    setApplicantsData([])
    setSearchTerm(searchTerm)
    setIsSearchMode(true)
    setCurrentPage(1)
    getAllData(currentPage, itemsPerPage, searchTerm)
  }

  const handleReset = () => {
    setSearchTerm('')
    setIsSearchMode(false)
    setCurrentPage(1)
    getAllData(currentPage, itemsPerPage)
  }

  useEffect(() => {
    getAllTagOptions()
    const delayDebounceFn = setTimeout(() => {
      getAllData(currentPage, itemsPerPage, searchTerm)
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [currentPage, itemsPerPage, isSearchMode, searchTerm])

  return (
    <>
      <CContainer className="d-flex flex-column gap-3">
        <CRow>
          <CContainer className="d-flex flex-column gap-3">
            <CForm onSubmit={handleSubmit(handleSearch)}>
              <CInputGroup>
                <CFormInput
                  type="text"
                  placeholder="Search"
                  {...register('searchTerm')}
                  invalid={!!errors.searchTerm}
                />
                <CTooltip placement="top" content="Search">
                  <CButton type="submit" color="primary">
                    <FontAwesomeIcon icon={faSearch} />
                  </CButton>
                </CTooltip>
                <CTooltip placement="top" content="Refresh">
                  <CButton color="primary" onClick={() => handleReset()}>
                    <FontAwesomeIcon icon={faRefresh} />
                  </CButton>
                </CTooltip>
              </CInputGroup>
              {errors.searchTerm && (
                <CFormFeedback invalid>{errors.searchTerm.message}</CFormFeedback>
              )}
            </CForm>
            <div className="d-flex flex-wrap gap-2">
              {formTags.map((tag) => (
                <CTooltip key={tag._id} content={selectedTags.includes(tag._id) ? 'Remove' : 'Add'}>
                  <CBadge
                    onClick={() => selectedTagHandler(tag._id)}
                    color={selectedTags.includes(tag._id) ? 'success' : 'danger'}
                    className="d-flex align-items-center justify-content-between"
                  >
                    {tag.name}
                    {selectedTags.includes(tag._id) && (
                      <FontAwesomeIcon icon={faXmark} className="ms-2" />
                    )}
                  </CBadge>
                </CTooltip>
              ))}
            </div>
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
                        <FontAwesomeIcon icon={faUser} />
                      </CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>Phone</CTableHeaderCell>
                      <CTableHeaderCell>Tags</CTableHeaderCell>
                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {isLoading ? (
                      <CTableRow>
                        <CTableDataCell colSpan={5}>
                          <div className="pt-3 text-center">
                            <CSpinner color="primary" variant="grow" />
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ) : applicantsData.length > 0 ? (
                      applicantsData.map((applicant) => (
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
                            <CTooltip
                              placement="top"
                              content="Schedule Interview for this applicant"
                            >
                              <CButton
                                onClick={() => getApplicant(applicant._id)}
                                className="btn btn-primary"
                                size="sm"
                              >
                                <FontAwesomeIcon icon={faCalendarAlt} />
                              </CButton>
                            </CTooltip>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={5}>No data available</CTableDataCell>
                      </CTableRow>
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
          <CCol>
            <ApplicantForm
              isVisible={formModal}
              onClose={() => setFormModal(false)}
              isDarkMode={isDarkMode}
              applicantData={applicantData}
            />
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

Applicants.propTypes = {
  theme: propTypes.string,
}

export default Applicants
