import React from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CTable,
  CTableRow,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CForm,
  CInputGroup,
  CButtonGroup,
  CFormInput,
  CButton,
  CTooltip,
  CSpinner,
  CBadge,
  CFormFeedback,
} from '@coreui/react'
import { faClipboardQuestion, faSearch, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { get } from '../../api/axios'
import { AppContext } from '../../context/appContext'
import { daysLeft, formatDate, trimString } from '../../utils'
import AppPagination from '../../components/AppPagination'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

const Jobposts = () => {
  const navigate = useNavigate()
  const { addToast } = React.useContext(AppContext)
  const [allData, setAllData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)
  const [isSearchMode, setIsSearchMode] = React.useState(false)
  const [searchInput, setSearchInput] = React.useState('')

  const getAllData = async (query = '', page, limit) => {
    setIsLoading(true)
    try {
      const res =
        query === '' || query === null || query === undefined
          ? await get(`/jobposter/all?page=${page}&limit=${limit}`)
          : await get(`/jobposter/all?query=${query}&page=${page}&limit=${limit}`)
      if (res.status === 200) {
        console.log('Data:', res.data)
        setAllData(res.data.data)
        setTotalPages(res.data.totalPages)
        setIsLoading(false)
        setIsSearchMode(false)
        return
      } else {
        addToast('Info', `No data found for \'${query}\'`, 'info')
        setIsLoading(false)
        setIsSearchMode(false)
      }
    } catch (error) {
      addToast('Danger', 'Failed to fetch data', 'Error')
      console.error(error)
      setIsLoading(false)
      setIsSearchMode(false)
    }
  }

  const searchSchema = z.object({
    query: z.string().min(3, { message: 'Search query must be at least 3 characters' }),
  })

  const {
    register: searchFormRegister,
    reset: searchFormReset,
    handleSubmit: searchFormSubmit,
    formState: { error: searhFormErrors },
  } = useForm({
    // resolver: zodResolver(searchSchema),
    // Debug
    resolver: async (data, context, options) => {
      const result = await zodResolver(searchSchema)(data, context, options)
      console.log('Validation result:', result)
      return result
    },
  })

  const handleSearchSubmit = async (data) => {
    setIsSearchMode(true)
    getAllData(data.query, currentPage, itemsPerPage)
  }

  const handleRefresh = () => {
    getAllData(searchInput, currentPage, itemsPerPage)
  }

  const handleView = (item) => {
    navigate(`/recruitment/jobposter/${item.ref_id}`)
  }

  React.useEffect(() => {
    getAllData(searchInput, currentPage, itemsPerPage)
  }, [searchInput, currentPage, itemsPerPage])

  return (
    <>
      <CContainer>
        <CRow className="mb-3">
          <CCol>
            <h1>Jobpost Tracker</h1>
            <small className="text-muted">
              In this page, you can view all the jobpost tracker data in various platforms.
            </small>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol>
            <CForm onSubmit={searchFormSubmit(handleSearchSubmit)}>
              <CInputGroup>
                <CFormInput
                  type="text"
                  placeholder="Search..."
                  {...searchFormRegister('query')}
                  invalid={!!searhFormErrors?.query}
                />
                {searhFormErrors?.query && (
                  <CFormFeedback className="text-danger">
                    {searhFormErrors.query.message}
                  </CFormFeedback>
                )}
                <CTooltip content="Search" placement="top">
                  <CButton type="submit" className="btn btn-primary">
                    <FontAwesomeIcon icon={faSearch} />
                  </CButton>
                </CTooltip>
                <CTooltip content="Refresh" placement="top">
                  <CButton onClick={handleRefresh} className="btn btn-primary">
                    <FontAwesomeIcon icon={faRefresh} />
                  </CButton>
                </CTooltip>
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
                      <CTableHeaderCell>
                        <div className="text-center">
                          <strong>#</strong>
                        </div>
                      </CTableHeaderCell>
                      <CTableHeaderCell>
                        <div className="text-center">Platform</div>
                      </CTableHeaderCell>
                      {/* <CTableHeaderCell>
                        <div className="text-center">Status</div>
                      </CTableHeaderCell> */}
                      <CTableHeaderCell>
                        <div className="text-center">Approved</div>
                      </CTableHeaderCell>
                      <CTableHeaderCell>
                        <div className="text-center">Posted</div>
                      </CTableHeaderCell>
                      <CTableHeaderCell>
                        <div className="text-center">Deleted</div>
                      </CTableHeaderCell>
                      <CTableHeaderCell>
                        <div className="text-center">Expires At</div>
                      </CTableHeaderCell>
                      <CTableHeaderCell>Content </CTableHeaderCell>
                      <CTableHeaderCell>
                        <div className="text-center">Actions</div>
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {isLoading ? (
                      <CTableRow>
                        <CTableDataCell colSpan="8" className="text-center">
                          <CSpinner color="primary" variant="grow" />
                        </CTableDataCell>
                      </CTableRow>
                    ) : allData.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="8">
                          <div className="text-center">No data</div>
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      allData.map((item) => {
                        return (
                          <CTableRow key={item._id}>
                            <CTableDataCell>
                              <CTooltip content={item._id} placement="top">
                                <div className="text-capitalize text-center">
                                  {trimString(item._id, 2)}
                                </div>
                              </CTooltip>
                            </CTableDataCell>
                            <CTableDataCell>
                              <div className="text-capitalize text-center">{item.platform}</div>
                            </CTableDataCell>
                            {/* <CTableDataCell className="text-center">
                              <CBadge color={item.status === 'active' ? 'success' : 'danger'}>
                                {item.status === 'active' ? 'Active' : 'Inactive'}
                              </CBadge>
                            </CTableDataCell> */}
                            <CTableDataCell className="text-center">
                              {item.isApproved ? (
                                <CBadge color="success">YES</CBadge>
                              ) : (
                                <CBadge color="danger">NO</CBadge>
                              )}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              {item.isPosted ? (
                                <CBadge color="success">YES</CBadge>
                              ) : (
                                <CBadge color="danger">NO</CBadge>
                              )}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              {item.isDeleted ? (
                                <CBadge color="danger">YES</CBadge>
                              ) : (
                                <CBadge color="info">NO</CBadge>
                              )}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CTooltip
                                content={daysLeft(item.expiresAt) + ' days left'}
                                placement="top"
                              >
                                <span
                                  className={
                                    daysLeft(item.expiresAt) > 0 ? 'text-info' : 'text-danger'
                                  }
                                >
                                  {formatDate(item.expiresAt, 'MMM d, YYYY')}
                                  {formatDate(item.expiresAt, 'MMM d, YYYY')}
                                </span>
                              </CTooltip>
                            </CTableDataCell>
                            <CTableDataCell>
                              <CTooltip content={trimString(item.content, 100)} placement="top">
                                <small>{trimString(item.content, 50)}</small>
                              </CTooltip>
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <CButtonGroup>
                                <CTooltip content="View" placement="top">
                                  <CButton color="info" onClick={() => handleView(item)}>
                                    <FontAwesomeIcon icon={faClipboardQuestion} />
                                  </CButton>
                                </CTooltip>
                              </CButtonGroup>
                            </CTableDataCell>
                          </CTableRow>
                        )
                      })
                    )}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <div className="mt-3 d-flex flex-row gap-2 justify-content-center align-items-center">
            <AppPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </CRow>
      </CContainer>
    </>
  )
}

export default Jobposts
