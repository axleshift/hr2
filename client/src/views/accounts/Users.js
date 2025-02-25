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
  CFormLabel,
  CForm,
  CInputGroup,
  CInputGroupText,
  CButtonGroup,
  CFormInput,
  CButton,
  CTooltip,
  CSpinner,
  CModal,
  CModalHeader,
  CModalBody,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faQuestion, faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons'
import { formatDate, trimString } from '../../utils'
import AppPagination from './../../components/AppPagination'
import { AppContext } from '../../context/appContext'
import { get, post, put } from '../../api/axios'
import { set, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const Users = () => {
  const { addToast } = React.useContext(AppContext)
  const [users, setUsers] = React.useState([])

  const [selectedUser, setSelectedUser] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isFetchLoading, setIsFetchLoading] = React.useState([])
  const [isUserModalVisible, setIsUserModalVisible] = React.useState(false)
  const [isSuspensionModalVisible, setIsSuspensionModalVisible] = React.useState(false)
  const [isActivateModalVisible, setIsActivateModalVisible] = React.useState(false)
  const [isEdit, setIsEdit] = React.useState(false)

  // search query
  const [searchQuery, setSearchQuery] = React.useState('')

  //
  const [isUserCreationLoading, setIsUserCreationLoading] = React.useState(false)

  //
  const [isVerifyLoading, setIsVerifyLoading] = React.useState(false)
  const [isVerifySent, setIsVerifySent] = React.useState(false)

  //
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)

  // pagination
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(9)
  const [totalPages, setTotalPages] = React.useState(0)
  const [totalItems, setTotalItems] = React.useState(0)

  const userFormSchema = z.object({
    _id: z.string().optional(),
    firstname: z.string().min(3, { message: 'Firstname must be at least 3 characters' }),
    lastname: z.string().min(3, { message: 'Lastname must be at least 3 characters' }),
    email: z.string().email('Invalid email address'),
    username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    role: z.string().min(3, { message: 'Role must be at least 3 characters' }),
    status: z.string().optional(),
    emailVerifiedAt: z
      .string()
      .optional()
      .transform((val) => {
        if (val) {
          return 'not verified'
        }
        const date = new Date(val)
        return formatDate(date, 'MMM DD, YYYY')
      }),
  })

  const {
    register: userFormRegister,
    reset: userFormReset,
    handleSubmit: userFormHandleSubmit,
    formState: { errors: userFormErrors },
  } = useForm({
    resolver: zodResolver(userFormSchema),
    // resolver: async (data, context, options) => {
    //   const result = await zodResolver(userFormSchema)(data, context, options)
    //   console.log('Validation result:', result)
    //   return result
    // },
  })

  const handleGetAllUsers = async (searchQuery = '', page, limit) => {
    try {
      const res = await get(`/account/all?page=${page}&limit=${limit}`)
      if (res.status === 200) {
        // console.log(res)
        setUsers(res.data.data)
        setIsFetchLoading(() => {
          const loadingMap = {}
          res.data.data.forEach((user) => {
            loadingMap[user._id] = false
          })
          return loadingMap
        })
        setTotalItems(res.data.totalItems)
        setTotalPages(res.data.totalPages)
        setCurrentPage(res.data.currentPage)
        setIsLoading(false)
      } else {
        addToast('Accounts | Users', res.message.message, 'danger')
      }
    } catch (error) {
      // console.log(error)
      addToast('Error', 'An error occurred', 'error')
    }
  }

  const handlePreCreateUser = () => {
    userFormReset({
      _id: '',
      firstname: '',
      lastname: '',
      email: '',
      username: '',
      password: '',
      role: '',
      status: 'inactive',
      emailVerifiedAt: null,
    })
    setSelectedUser(null)
    setIsEdit(false)
    setIsUserModalVisible(true)
  }

  const handleSubmit = async (data) => {
    try {
      // console.log('handleSubmit -> data', data)
      const res = isEdit ? await put(`/account/${data._id}`, data) : await post('/account', data)
      if (res.status === 200 || res.status === 201) {
        // console.log('handleSubmit -> user', res.data)
        isEdit
          ? addToast('Success', 'User updated successfully', 'success')
          : addToast('Success', 'User created successfully', 'success')
        setIsUserModalVisible(false)
      } else {
        // console.log('handleSubmit -> error', res)
        addToast('Error', res.message.message, 'error')
      }
    } catch (error) {
      // console.log(error)
      addToast('Error', 'An error occurred', ' error')
    }
  }

  const handleViewUser = async (user) => {
    setIsFetchLoading((prev) => {
      return { ...prev, [user._id]: true }
    })
    try {
      const res = await get(`/account/${user._id}`)
      if (res.status === 200) {
        // console.log('User fetched successfully', res.data)
        setSelectedUser(res.data.data)
        userFormReset({
          ...res.data.data,
          password: '',
        })
        setIsEdit(true)
        setIsUserModalVisible(true)
        addToast('Success', 'User fetched successfully', 'success')
        setIsFetchLoading((prev) => {
          return { ...prev, [user._id]: false }
        })
      } else {
        addToast('Error', 'An error occurred', 'error')
        setIsFetchLoading((prev) => {
          return { ...prev, [user._id]: false }
        })
      }
    } catch (error) {
      // console.log(error)
      addToast('Error', 'An error occurred', 'error')
      setIsFetchLoading((prev) => {
        return { ...prev, [user._id]: false }
      })
    }
  }

  const handleSendVerification = () => {
    setIsVerifyLoading(true)
    // send verification
    setTimeout(() => {
      setIsVerifySent(true)
      setIsVerifyLoading(false)
    }, 2000)
  }

  React.useEffect(() => {
    handleGetAllUsers('', currentPage, itemsPerPage)
  }, [currentPage, itemsPerPage])

  return (
    <>
      <CContainer>
        <CRow className="mb-3">
          <CCol>
            <h2>Users</h2>
            <small>
              In this page, you can view all the users in the system. You can also add, edit users,
              and as well as verify their accounts.
            </small>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol>
            <div className="d-flex justify-content-end">
              <CButton color="primary" onClick={handlePreCreateUser}>
                Create
              </CButton>
            </div>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol>
            <CForm>
              <CInputGroup>
                <CFormInput type="search" placeholder="Search..." aria-label="Search" />
                <CButton type="button" color="primary">
                  <FontAwesomeIcon icon={faSearch} />
                </CButton>
                <CButton type="button" color="primary">
                  <FontAwesomeIcon icon={faRefresh} onClick={handleGetAllUsers} />
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
                      <CTableHeaderCell>Firstname</CTableHeaderCell>
                      <CTableHeaderCell>Lastname</CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>Username</CTableHeaderCell>
                      <CTableHeaderCell>Role</CTableHeaderCell>
                      <CTableHeaderCell>Verified</CTableHeaderCell>
                      {/* <CTableHeaderCell>Status</CTableHeaderCell> */}
                      <CTableHeaderCell>View</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {isLoading ? (
                      <CTableRow>
                        <CTableDataCell colSpan="8" className="text-center">
                          <CSpinner />
                        </CTableDataCell>
                      </CTableRow>
                    ) : users.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="8" className="text-center">
                          No users found.
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      users.map((item, index) => (
                        <CTableRow key={item._id}>
                          <CTableDataCell>{trimString(item._id, 10)}</CTableDataCell>
                          <CTableDataCell>{trimString(item.firstname, 25)}</CTableDataCell>
                          <CTableDataCell>{trimString(item.lastname, 25)}</CTableDataCell>
                          <CTableDataCell>{item.email}</CTableDataCell>
                          <CTableDataCell>{item.username}</CTableDataCell>
                          <CTableDataCell>{item.role}</CTableDataCell>
                          <CTableDataCell>
                            {item.emailVerifiedAt ? (
                              formatDate(item.emailVerifiedAt, 'MMM DD, YYYY')
                            ) : (
                              <span className="text-danger">Not verified</span>
                            )}
                          </CTableDataCell>
                          {/* <CTableDataCell>
                            <CBadge color={user.status === 'active' ? 'success' : 'danger'}>
                              {user.status}
                            </CBadge>
                          </CTableDataCell> */}
                          <CTableDataCell>
                            <CButtonGroup>
                              <CTooltip content="View">
                                <CButton
                                  color="info"
                                  size="sm"
                                  onClick={() => {
                                    handleViewUser(item)
                                  }}
                                  disabled={isFetchLoading[item._id]}
                                >
                                  {isFetchLoading[item._id] ? (
                                    <CSpinner color="white" size="sm" />
                                  ) : (
                                    'View'
                                  )}
                                </CButton>
                              </CTooltip>
                              {/* <CTooltip content="Delete">
                                <CButton color="danger" size="sm">
                                  Delete
                                </CButton>
                              </CTooltip> */}
                            </CButtonGroup>
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
        {!isLoading && (
          <CRow>
            <CCol className="d-flex justify-content-center">
              <AppPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </CCol>
          </CRow>
        )}
        <CRow>
          <CCol>
            <CModal
              visible={isUserModalVisible}
              backdrop="static"
              onClose={() => {
                setIsUserModalVisible(false)
                setIsVerifySent(false)
              }}
              size="lg"
            >
              <CModalHeader>
                <strong>{isEdit ? 'Edit' : 'Create'} User</strong>
              </CModalHeader>
              <CModalBody>
                <CForm onSubmit={userFormHandleSubmit(handleSubmit)}>
                  <CRow className="mb-3 visually-hidden">
                    <CCol>
                      <CFormLabel>Id</CFormLabel>
                      <CFormInput type="text" {...userFormRegister('_id')} readOnly />
                    </CCol>
                  </CRow>
                  <CRow
                    className="mb-3"
                    xs={{
                      cols: 1,
                      gutter: 2,
                    }}
                    md={{
                      cols: 2,
                      gutter: 2,
                    }}
                  >
                    <CCol>
                      <CFormLabel>Firstname</CFormLabel>
                      <CFormInput type="text" {...userFormRegister('firstname')} />
                    </CCol>
                    <CCol>
                      <CFormLabel>Lastname</CFormLabel>
                      <CFormInput type="text" {...userFormRegister('lastname')} />
                    </CCol>
                  </CRow>
                  <CRow
                    className="mb-3"
                    xs={{
                      cols: 1,
                      gutter: 2,
                    }}
                    md={{
                      cols: 3,
                      gutter: 2,
                    }}
                  >
                    <CCol>
                      <CFormLabel>Email</CFormLabel>
                      <CFormInput type="email" {...userFormRegister('email')} />
                    </CCol>
                    <CCol>
                      <CFormLabel>Username</CFormLabel>
                      <CFormInput type="text" {...userFormRegister('username')} />
                    </CCol>
                    <CCol>
                      <CFormLabel>Password</CFormLabel>
                      <CInputGroup>
                        <CFormInput type="text" {...userFormRegister('password')} />
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  {isEdit && (
                    <CRow className="mb-3">
                      <CCol>
                        <CFormLabel>Role</CFormLabel>
                        <CFormInput type="text" {...userFormRegister('role')} />
                      </CCol>
                      <CCol>
                        <CFormLabel>Account Status</CFormLabel>
                        <br />
                        <CFormInput type="text" {...userFormRegister('status')} readOnly />
                      </CCol>
                      <CCol>
                        <CFormLabel>Email Verified At</CFormLabel>
                        <CInputGroup>
                          <CFormInput
                            type="text"
                            defaultValue={
                              selectedUser?.emailVerifiedAt
                                ? formatDate(selectedUser?.emailVerifiedAt, 'MMM DD, YYYY')
                                : 'Not verified'
                            }
                            readOnly
                          />
                          <CInputGroupText>
                            {selectedUser?.emailVerifiedAt ? (
                              <FontAwesomeIcon icon={faCheck} color="green" />
                            ) : (
                              <CTooltip content="Verify?">
                                <FontAwesomeIcon icon={faQuestion} color="red" />
                              </CTooltip>
                            )}
                          </CInputGroupText>
                        </CInputGroup>
                      </CCol>
                    </CRow>
                  )}

                  <CRow className="mb-3">
                    <CCol>
                      {/* Actions*/}
                      <div className="d-flex justify-content-end">
                        {isEdit ? (
                          <>
                            <CButton type="submit" color="primary" className="me-2">
                              Update
                            </CButton>
                            {selectedUser?.status === 'active' ? (
                              <CButton
                                color="danger"
                                className="me-2"
                                onClick={() => {
                                  setIsSuspensionModalVisible(true)
                                  setIsUserModalVisible(false)
                                }}
                              >
                                Suspend
                              </CButton>
                            ) : (
                              <CButton
                                color="success"
                                className="me-2"
                                onClick={() => {
                                  setIsActivateModalVisible(true)
                                  setIsUserModalVisible(false)
                                }}
                                disabled={!selectedUser?.emailVerifiedAt}
                              >
                                Activate
                              </CButton>
                            )}
                          </>
                        ) : (
                          <CButton type="submit" color="primary" className="me-2">
                            {isUserCreationLoading ? <CSpinner color="white" size="sm" /> : 'Add'}
                          </CButton>
                        )}
                      </div>
                    </CCol>
                  </CRow>
                  {!selectedUser?.emailVerifiedAt && (
                    <CRow className="mb-3">
                      <CCol>
                        <div className="d-flex justify-content-end">
                          <CButton
                            color="success"
                            className="me-2"
                            onClick={handleSendVerification}
                            disabled={isVerifySent || isVerifyLoading}
                          >
                            {isVerifyLoading ? (
                              <CSpinner color="white" size="sm" />
                            ) : isVerifySent ? (
                              <span>
                                Verification Sent
                                <FontAwesomeIcon icon={faCheck} className="ms-2" />
                              </span>
                            ) : (
                              'Send Verification'
                            )}
                          </CButton>
                        </div>
                        {!selectedUser?.emailVerifiedAt && (
                          <div className="d-flex justify-content-end mt-3">
                            <small>
                              <span className="text-danger">Note</span>: User cannot be activated
                              until email is verified.
                            </small>
                          </div>
                        )}
                      </CCol>
                    </CRow>
                  )}
                </CForm>
              </CModalBody>
            </CModal>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CModal
              visible={isSuspensionModalVisible}
              backdrop="static"
              onClose={() => {
                setIsSuspensionModalVisible(false)
                setIsUserModalVisible(true)
              }}
            >
              <CModalHeader>
                <strong>Suspend / Deactivate User</strong>
              </CModalHeader>
              <CModalBody>
                <CForm>
                  <CRow className="mb-3">
                    <CCol>
                      <CFormLabel>Reason (required)</CFormLabel>
                      <CFormInput type="text" />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol>
                      <div className="d-flex justify-content-end">
                        <CButton color="primary" className="me-2">
                          Suspend
                        </CButton>
                      </div>
                    </CCol>
                  </CRow>
                </CForm>
              </CModalBody>
            </CModal>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CModal
              visible={isActivateModalVisible}
              onClose={() => {
                setIsActivateModalVisible(false)
                setIsUserModalVisible(true)
              }}
            >
              <CModalHeader>
                <strong>Activate User</strong>
              </CModalHeader>
              <CModalBody>
                <CForm>
                  <CRow className="mb-3">
                    <CCol>
                      <CFormLabel>Reason (required)</CFormLabel>
                      <CFormInput type="text" />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol>
                      <div className="d-flex justify-content-end">
                        <CButton color="primary" className="me-2">
                          Activate
                        </CButton>
                      </div>
                    </CCol>
                  </CRow>
                </CForm>
              </CModalBody>
            </CModal>
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default Users
