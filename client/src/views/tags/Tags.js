import React, { useEffect, useState } from 'react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import dayjs from 'dayjs'
import { post, put, get } from '../../api/axios'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormCheck,
  CFormFeedback,
  CCollapse,
  CButtonGroup,
  CTooltip,
  CBadge,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faCircleChevronLeft,
  faChevronRight,
  faCircleChevronRight,
  faLocationPin,
  faMoneyBill,
  faRefresh,
  faTrash,
  faPencil,
  faCalendar,
  faSave,
  faSearch,
} from '@fortawesome/free-solid-svg-icons'
import {
  formattedDate,
  formattedDateMMM,
  formatCurency,
  trimString,
  firstLetterUppercase,
} from '../../utils'

const Tags = () => {
  // Tags
  const [allTagData, setAllTagData] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [isTagsExpanded, setIsTagsExpanded] = useState(true)

  // Search
  const [searchInput, setSearchInput] = useState('')
  const [isSearchMode, setIsSearchMode] = useState(false)

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalPages, setTotalPages] = useState(0)

  const getAllTagData = async () => {
    try {
      const res = isSearchMode
        ? await get(`/tags/search?query=${searchInput}&page=${currentPage}&limit=${itemsPerPage}`)
        : await get(`/tags/all?page=${currentPage}&limit=${itemsPerPage}`)
      if (res.success === true) {
        console.log(res)
        setAllTagData(res.data)
        setTotalPages(res.totalPages)
        setCurrentPage(res.currentPage)
      } else {
        console.log(res)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const tagsFormSchema = z.object({
    id: z.string().optional(),
    name: z
      .string()
      .min(3, { message: 'Tag name must be at least 3 characters long' })
      .max(50, { message: 'Tag name must not exceed 50 characters' }),
    category: z
      .string()
      .min(3, { message: 'Category name must be at least 3 characters long' })
      .max(50, { message: 'Category name must not exceed 50 characters' }),
    description: z.string().optional(),
  })

  const {
    register: tagsFormRegister,
    reset: tagsFormReset,
    handleSubmit: tagsFormHandleSubmit,
    formState: { errors: tagsFormErrors },
  } = useForm({
    // resolver: zodResolver(tagsFormSchema),
    resolver: async (data, context, options) => {
      const result = await zodResolver(tagsFormSchema)(data, context, options)
      console.log('Validation result:', result)
      return result
    },
  })

  const submitTag = async (data) => {
    try {
      // check if name and category already exist
      // if exist, notify user
      // else, submit data
      const isExist = allTagData.find(
        (tag) => tag.name === data.name && tag.category === data.category,
      )
      if (!isEdit && isExist) {
        console.log('Tag already exist')
        return
      }

      const res = isEdit ? await put(`/tags/${data._id}`, data) : await post('/tags', data)
      if (res.success === true) {
        console.log(res.data)
        tagsFormReset({
          name: '',
          category: '',
        })
        setIsEdit(false)
        setIsTagsExpanded(true)
        getAllTagData()
      } else {
        console.log(res)
      }
    } catch (error) {
      console.error
    }
  }

  const handleEditTag = async (tag) => {
    try {
      setIsEdit(true)
      setIsTagsExpanded(true)
      const res = await get(`/tags/${tag}`)
      if (res.success === true) {
        console.log(res.data)
        tagsFormReset(res.data)
      }
      console.log(tag)
    } catch (error) {
      console.error
    }
  }

  const handleDeleteTag = async (tag) => {
    try {
      console.log(tag)
    } catch (error) {
      console.error
    }
  }

  const handleReset = () => {
    tagsFormReset({
      name: '',
      category: '',
    })
    setIsEdit(false)
    setIsTagsExpanded(true)
  }

  // Search
  const searchSchema = z.object({
    searchInput: z.string().min(3, { message: 'Search query must be at least 3 characters long' }),
  })

  const {
    register: searchRegister,
    reset: searchReset,
    handleSubmit: searchHandleSubmit,
    formState: { errors: searchErrors },
  } = useForm({
    resolver: zodResolver(searchSchema),
  })

  const submitSearch = async (data) => {
    try {
      console.log(data)
      setSearchInput(data.searchInput)
      setIsSearchMode(true)
      getAllTagData()
    } catch (error) {
      console.log(error)
    }
  }

  const handlePageChange = (action) => {
    console.log('Action: ', action)

    switch (action) {
      case 'firstPage':
        setCurrentPage(1)
        break

      case 'prevPage':
        setCurrentPage((prevPage) => prevPage - 1)
        break

      case 'nextPage':
        setCurrentPage((prevPage) => prevPage + 1)
        break

      case 'lastPage':
        setCurrentPage(totalPages)
        break

      default:
        console.warn('Unknown action:', action)
    }
  }

  useEffect(() => {
    // debounce search
    const delayDebounceFn = setTimeout(() => {
      getAllTagData()
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [currentPage, itemsPerPage, isSearchMode, searchInput])

  return (
    <CContainer className="d-flex flex-column gap-3">
      <CRow>
        <CContainer>
          <CCard>
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-2 justify-content-between align-items-center">
                  <strong>Jobposting Form</strong>
                  <span
                    className={
                      isEdit
                        ? 'badge rounded-pill text text-danger'
                        : 'badge rounded-pill text text-success'
                    }
                  >
                    {isEdit ? 'Edit Mode' : 'Create Mode'}
                  </span>
                </div>
                <div className="d-flex flex-row gap-2">
                  {isEdit && (
                    <CTooltip content="Reset form" placement="top">
                      <CButton onClick={() => handleReset()} className="btn btn-danger">
                        <FontAwesomeIcon icon={faTrash} />
                      </CButton>
                    </CTooltip>
                  )}
                  <CTooltip content={isTagsExpanded ? 'Collapse' : 'Expand'} placement="top">
                    <CButton
                      onClick={() => setIsTagsExpanded(!isTagsExpanded)}
                      className="btn btn-primary"
                    >
                      <FontAwesomeIcon icon={isTagsExpanded ? faChevronUp : faChevronDown} />
                    </CButton>
                  </CTooltip>
                </div>
              </div>
            </CCardHeader>
            <CCollapse visible={isTagsExpanded}>
              <CCardBody>
                <CForm onSubmit={tagsFormHandleSubmit(submitTag)}>
                  <CContainer className="d-flex flex-column gap-2">
                    <CRow>
                      <CCol>
                        <CFormInput
                          type="hidden"
                          id="id"
                          {...tagsFormRegister('id')}
                          invalid={!!tagsFormErrors.id}
                        />
                        {tagsFormErrors && tagsFormErrors.id && (
                          <CFormFeedback className="text-danger">
                            {tagsFormErrors.id.message}
                          </CFormFeedback>
                        )}
                        <CFormInput
                          type="text"
                          id="name"
                          placeholder="..."
                          label="Tag Name"
                          {...tagsFormRegister('name')}
                          invalid={!!tagsFormErrors.name}
                        />
                        {tagsFormErrors && tagsFormErrors.name && (
                          <CFormFeedback className="text-danger">
                            {tagsFormErrors.name.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CFormInput
                          type="text"
                          id="category"
                          placeholder="Category"
                          label="Category"
                          {...tagsFormRegister('category')}
                          invalid={!!tagsFormErrors.category}
                        />
                        {tagsFormErrors && tagsFormErrors.category && (
                          <CFormFeedback className="text-danger">
                            {tagsFormErrors.category.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                    <div className="d-flex justify-content-end">
                      <CButton color="primary" type="submit" className="mb-3 w-25">
                        Submit
                      </CButton>
                    </div>
                  </CContainer>
                </CForm>
              </CCardBody>
            </CCollapse>
          </CCard>
        </CContainer>
      </CRow>
      <CRow>
        <CContainer>
          <CCard>
            <CCardHeader>
              <div className="d-flex justify-content-between">
                <div className="d-flex justify-content-between align-items-center">
                  <strong>All Tags</strong>
                </div>
                <div>
                  <CForm
                    onSubmit={searchHandleSubmit(submitSearch)}
                    className="d-flex flex-row gap-2"
                  >
                    <div>
                      <CFormInput
                        placeholder="..."
                        id="searcInput"
                        {...searchRegister('searchInput')}
                        invalid={!!searchErrors.searchInput}
                      />
                      {searchErrors && searchErrors.searchInput && (
                        <CFormFeedback className="text-danger">
                          {searchErrors.searchInput.message}
                        </CFormFeedback>
                      )}
                    </div>
                    <CTooltip content="Search tags" placement="top">
                      <CButton type="submit" className="btn btn-primary">
                        <FontAwesomeIcon icon={faSearch} />
                      </CButton>
                    </CTooltip>
                  </CForm>
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              <CContainer>
                <CRow>
                  {allTagData.map((tag, index) => (
                    <CCol key={index} md={4} className="mb-3">
                      <CCard className="h-100">
                        <CCardBody>
                          <CRow>
                            <CCol>
                              <h5>{firstLetterUppercase(tag.name)}</h5>
                              <p>{tag.category}</p>
                            </CCol>
                          </CRow>
                        </CCardBody>
                        <CCardFooter>
                          <CRow>
                            <CCol>
                              <CButtonGroup>
                                <CTooltip content="Edit tag" placement="top">
                                  <CButton color="primary" onClick={() => handleEditTag(tag._id)}>
                                    <FontAwesomeIcon icon={faPencil} />
                                  </CButton>
                                </CTooltip>
                                <CTooltip content="Delete tag" placement="top">
                                  <CButton color="danger" onClick={() => handleDeleteTag(tag._id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                  </CButton>
                                </CTooltip>
                              </CButtonGroup>
                            </CCol>
                          </CRow>
                        </CCardFooter>
                      </CCard>
                    </CCol>
                  ))}
                </CRow>
              </CContainer>
            </CCardBody>
            <CCardFooter className="d-flex justify-content-center">
              <CPagination>
                <CPaginationItem
                  onClick={() => handlePageChange('firstPage')}
                  disabled={currentPage === 1}
                >
                  &laquo;
                </CPaginationItem>
                {currentPage > 3 && (
                  <>
                    <CPaginationItem onClick={() => setCurrentPage(1)}>1</CPaginationItem>
                    <CPaginationItem disabled>...</CPaginationItem>
                  </>
                )}
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1
                  if (page >= currentPage - 2 && page <= currentPage + 2) {
                    return (
                      <CPaginationItem
                        key={index}
                        onClick={() => setCurrentPage(page)}
                        active={currentPage === page}
                      >
                        {page}
                      </CPaginationItem>
                    )
                  }
                  return null
                })}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <CPaginationItem disabled>...</CPaginationItem>
                    )}
                    <CPaginationItem onClick={() => setCurrentPage(totalPages)}>
                      {totalPages}
                    </CPaginationItem>
                  </>
                )}
                <CPaginationItem
                  onClick={() => handlePageChange('nextPage')}
                  disabled={currentPage === totalPages}
                >
                  &raquo;
                </CPaginationItem>
              </CPagination>
            </CCardFooter>
          </CCard>
        </CContainer>
      </CRow>
    </CContainer>
  )
}

export default Tags
