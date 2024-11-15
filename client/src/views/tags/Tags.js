import React, { useEffect, useState, useContext } from 'react'

import { set, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import dayjs from 'dayjs'
import { post, put, get, del } from '../../api/axios'
import { AuthContext } from '../../context/authContext'
import { AppContext } from '../../context/appContext'

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
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import AppPagination from '../../components/AppPagination'
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
  faLock,
  faUnlock,
  faCog,
  faCogs,
  faGear,
  faUserGear,
} from '@fortawesome/free-solid-svg-icons'
import {
  formattedDate,
  formattedDateMMM,
  formatCurency,
  trimString,
  firstLetterUppercase,
} from '../../utils'

const Tags = () => {
  const { addToast } = useContext(AppContext)
  // Tags
  const [allTagData, setAllTagData] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [isTagsExpanded, setIsTagsExpanded] = useState(true)

  // modal
  const [deleteModal, setDeleteModal] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  // Search
  const [searchInput, setSearchInput] = useState('')
  const [isSearchMode, setIsSearchMode] = useState(false)

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalPages, setTotalPages] = useState(0)

  // user information from auth context
  const { userInformation } = useContext(AuthContext)

  const getAllTagData = async () => {
    try {
      const res = isSearchMode
        ? await get(`/tags/search?query=${searchInput}&page=${currentPage}&limit=${itemsPerPage}`)
        : await get(`/tags/all?page=${currentPage}&limit=${itemsPerPage}`)
      if (res.status === 200) {
        setAllTagData(res.data.data)
        setTotalPages(res.data.totalPages)
        setCurrentPage(res.data.currentPage)
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
    isProtected: z
      .preprocess((val) => val === 'true' || val === true, z.boolean())
      .optional()
      .default(false),
    isSystem: z
      .preprocess((val) => val === 'true' || val === true, z.boolean())
      .optional()
      .default(false),
    description: z.string().optional(),
  })

  const {
    register: tagsFormRegister,
    reset: tagsFormReset,
    handleSubmit: tagsFormHandleSubmit,
    formState: { errors: tagsFormErrors },
  } = useForm({
    resolver: zodResolver(tagsFormSchema),
    // resolver: async (data, context, options) => {
    //   const result = await zodResolver(tagsFormSchema)(data, context, options)
    //   console.log('Validation result:', result)
    //   return result
    // },
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
      console.log(data)
      const res = isEdit ? await put(`/tags/${data.id}`, data) : await post('/tags', data)
      if (res.status === 200 || res.status === 201) {
        addToast('Success', 'Tag has been added successfully', 'success')
        tagsFormReset({
          id: '',
          name: '',
          category: '',
          isProtected: false,
          isSystem: false,
        })
        setIsEdit(false)
        setIsTagsExpanded(true)
        getAllTagData()
      } else {
        addToast('Error', 'An error occurred while adding the tag', 'danger')
      }
    } catch (error) {
      addToast('Error', 'An error occurred while adding the tag', 'danger')
    }
  }

  const handleEditTag = async (tag) => {
    try {
      setIsEdit(true)
      setIsTagsExpanded(true)
      const res = await get(`/tags/${tag}`)
      if (res.status === 200) {
        const data = {
          id: res.data.data._id,
          name: res.data.data.name,
          category: res.data.data.category,
          isProtected: res.data.data.isProtected || false,
          isSystem: res.data.data.isSystem || false,
        }
        tagsFormReset(data)
        addToast('Success', `Tag is successfully retrieved`, 'success')
      }
    } catch (error) {
      addToast('Error', 'An error occurred while fetching the tag', 'danger')
    }
  }

  const handleDeleteTag = async (tag) => {
    try {
      if (!confirm('Are you sure you want to delete this tag?')) return
      const res = await del(`/tags/${tag}`)
      if (res.status === 200) {
        getAllTagData()
      }
    } catch (error) {
      addToast('Error', 'An error occurred while deleting the tag', 'danger')
    }
  }

  const handleReset = () => {
    tagsFormReset({
      id: '',
      name: '',
      category: '',
      isProtected: false,
      isSystem: false,
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
                    <CRow>
                      <CCol>
                        <CFormLabel>Protected?</CFormLabel>
                        <CInputGroup>
                          <CFormInput
                            type="text"
                            id="protected"
                            placeholder="Protected"
                            readOnly
                            defaultValue={false}
                            {...tagsFormRegister('isProtected')}
                            invalid={!!tagsFormErrors.isProtected}
                          />
                          <CTooltip content="Protect" placement="top">
                            <CButton
                              onClick={() => tagsFormReset({ isProtected: true })}
                              className={'btn btn-primary'}
                            >
                              <FontAwesomeIcon icon={faLock} />
                            </CButton>
                          </CTooltip>
                          <CTooltip content="Unprotect" placement="top">
                            <CButton
                              onClick={() => tagsFormReset({ isProtected: false })}
                              className={'btn btn-warning'}
                            >
                              <FontAwesomeIcon icon={faUnlock} />
                            </CButton>
                          </CTooltip>
                        </CInputGroup>
                        {tagsFormErrors && tagsFormErrors.isProtected && (
                          <CFormFeedback className="text-danger">
                            {tagsFormErrors.isProtected.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CFormLabel>System Tag ?</CFormLabel>
                        <CInputGroup>
                          <CFormInput
                            type="text"
                            id="system"
                            placeholder="..."
                            readOnly
                            defaultValue={false}
                            {...tagsFormRegister('isSystem')}
                            invalid={!!tagsFormErrors.isSystem}
                          />
                          <CTooltip content="Protect" placement="top">
                            <CButton
                              onClick={() => tagsFormReset({ isSystem: true })}
                              className={'btn btn-primary'}
                            >
                              <FontAwesomeIcon icon={faGear} />
                            </CButton>
                          </CTooltip>
                          <CTooltip content="Unprotect" placement="top">
                            <CButton
                              onClick={() => tagsFormReset({ isSystem: false })}
                              className={'btn btn-warning'}
                            >
                              <FontAwesomeIcon icon={faUserGear} />
                            </CButton>
                          </CTooltip>
                        </CInputGroup>
                        {tagsFormErrors && tagsFormErrors.isSystem && (
                          <CFormFeedback className="text-danger">
                            {tagsFormErrors.isSystem.message}
                          </CFormFeedback>
                        )}
                      </CCol>
                    </CRow>
                    <div className="d-flex justify-content-end">
                      <CButton color="primary" type="submit" className="mb-3 w-25">
                        {isEdit ? 'Update' : 'Submit'}
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
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-between align-items-center">
            <strong>All Tags</strong>
          </div>
          <div>
            <CForm onSubmit={searchHandleSubmit(submitSearch)}>
              <CInputGroup>
                <CFormInput
                  placeholder="..."
                  id="searcInput"
                  {...searchRegister('searchInput')}
                  invalid={!!searchErrors.searchInput}
                />
                <CTooltip content="Search tags" placement="top">
                  <CButton type="submit" className="btn btn-primary">
                    <FontAwesomeIcon icon={faSearch} />
                  </CButton>
                </CTooltip>
              </CInputGroup>
              {searchErrors && searchErrors.searchInput && (
                <CFormFeedback className="text-danger">
                  {searchErrors.searchInput.message}
                </CFormFeedback>
              )}
            </CForm>
          </div>
        </div>
      </CRow>
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
                <CRow>
                  <CCol>Protected: {tag.isProtected ? 'Yes' : 'No'}</CCol>
                </CRow>
                <CRow>
                  <CCol>System Tag: {tag.isSystem ? 'Yes' : 'No'}</CCol>
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
                        <CButton
                          color="danger"
                          onClick={() => setDeleteModal(true)}
                          disabled={tag.isProtected}
                        >
                          <FontAwesomeIcon icon={tag.isProtected ? faLock : faTrash} />
                        </CButton>
                      </CTooltip>
                    </CButtonGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
                      <CModalHeader>
                        <CModalTitle>Warning</CModalTitle>
                      </CModalHeader>
                      <CModalBody>
                        <div>
                          <p>Are you sure you want to delete this tag?</p>
                          <p>
                            Name: <strong>{tag.name}</strong>
                            <br />
                            Category: <strong>{tag.category}</strong>
                          </p>
                          <p>
                            <strong>Note:</strong> This action cannot be undone.
                          </p>
                          <p>There&apos;s no way to recover the tag once it&apos;s deleted.</p>
                          <p>
                            This is important because tags are used to categorize and organize
                            content. Deleting a tag can result in the loss of important information
                            and make it difficult to find and manage content.
                          </p>
                          <p>
                            <strong>What this action does:</strong>
                          </p>
                          <p>
                            It removes the tag from the system and removes the tag from any content.
                          </p>
                          <p>
                            if the tag is used in any content, it will no longer be associated with
                            that content.
                          </p>
                        </div>
                      </CModalBody>
                      <CModalFooter>
                        <CCol className="d-flex justify-content-end">
                          <CFormCheck
                            type="checkbox"
                            id="invalidCheck"
                            label="I confirm that I understand the consequences of this action."
                            checked={isConfirmed}
                            onChange={() => setIsConfirmed(!isConfirmed)}
                          />
                          <CFormFeedback invalid>You must agree before submitting.</CFormFeedback>
                        </CCol>
                        <CButton
                          onClick={() => handleDeleteTag(tag._id)}
                          disabled={!isConfirmed}
                          className="btn btn-danger"
                        >
                          Delete
                        </CButton>
                      </CModalFooter>
                    </CModal>
                  </CCol>
                </CRow>
              </CCardFooter>
            </CCard>
          </CCol>
        ))}
      </CRow>
      <CRow>
        <div className="d-flex justify-content-center">
          <AppPagination
            currentPage={currentPage}
            totalPages={totalPages || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </CRow>
    </CContainer>
  )
}
export default Tags
