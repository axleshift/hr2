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
  CForm,
  CFormInput,
  CInputGroup,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
  CFormCheck,
} from '@coreui/react'

import React, { useContext, useEffect } from 'react'
import { AppContext } from '../../context/appContext'
import { del, get } from '../../api/axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'

import FacilityForm from './modals/FacilityForm'
import ManageFacilityForm from './modals/ManageFacilityForm'

const Facilities = () => {
  const { addToast } = useContext(AppContext)
  const [facilities, setFacilities] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')

  // form state
  const [isFormVisible, setIsFormVisible] = React.useState(false)
  const [facilityData, setFacilityData] = React.useState({})
  const [isEdit, setIsEdit] = React.useState(false)

  // modal state
  const [deleteModal, setDeleteModal] = React.useState(false)
  const [selectedFacility, setSelectedFacility] = React.useState({})
  const [isConfirmDelete, setIsConfirmDelete] = React.useState(false)

  const [isManageFacilityFormVisible, setIsManageFacilityFormVisible] = React.useState(false)

  const getAllFacilitiesData = async () => {
    try {
      const res = await get(`/facilities/all`)
      if (res.status === 404) {
        setIsLoading(false)
        return addToast('Error', 'Facilities not found', 'danger')
      }
      console.log(res.data)
      setFacilities(res.data.data)
      setIsLoading(false)
    } catch (error) {
      console.error(error)
      addToast('Error', 'An Error Occurred', 'danger')
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await del(`/facilities/delete/${id}`)
      if (res.status === 404) {
        setIsLoading(false)
        return addToast('Error', 'Facility not found', 'danger')
      }
      addToast('Success', 'Facility deleted successfully', 'success')
      setIsLoading(false)
      getAllFacilitiesData()
    } catch (error) {
      console.error(error)
      addToast('Error', 'An Error Occurred', 'danger')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getAllFacilitiesData()
  }, [])

  return (
    <>
      <CContainer>
        <CRow className="mb-3">
          <CCol>
            <h2>Facilities</h2>
            <small>
              In this page you can create, remove, update, and delete all the facilities available
              in the system.
            </small>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol>
            <div className="d-flex justify-content-end">
              <CButton
                color="primary"
                onClick={() => {
                  setIsEdit(false)
                  setIsFormVisible(true)
                }}
              >
                Create Facility
              </CButton>
              <CButton
                color="info"
                className="ms-2"
                onClick={() => {
                  getAllFacilitiesData()
                }}
              >
                <FontAwesomeIcon icon={faRefresh} />
              </CButton>
            </div>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            {isLoading ? (
              <div className="d-flex justify-content-center align-items-center">
                <CSpinner />
              </div>
            ) : (
              <CCard>
                <CCardBody>
                  {/* <CForm>
                      <CInputGroup>
                        <CFormInput
                          type="text"
                          placeholder="Search"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </CInputGroup>
                    </CForm> */}
                  <CTable align="middle" hover responsive striped>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Facility Name</CTableHeaderCell>
                        <CTableHeaderCell>Facility Type</CTableHeaderCell>
                        <CTableHeaderCell>Facility Description</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {facilities.map((item) => (
                        <CTableRow key={item._id}>
                          <CTableDataCell>{item.name}</CTableDataCell>
                          <CTableDataCell>{item.type}</CTableDataCell>
                          <CTableDataCell>{item.description}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="info"
                              size="sm"
                              onClick={() => {
                                setIsEdit(true)
                                setFacilityData(item)
                                setIsFormVisible(true)
                              }}
                            >
                              Edit
                            </CButton>
                            <CButton
                              color="danger"
                              size="sm"
                              className="ms-2"
                              onClick={() => {
                                setSelectedFacility(item)
                                setDeleteModal(true)
                              }}
                            >
                              Delete
                            </CButton>
                            <CButton
                              color="primary"
                              size="sm"
                              className="ms-2"
                              onClick={() => {
                                setFacilityData(item)
                                setIsManageFacilityFormVisible(true)
                              }}
                            >
                              Manage
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            )}
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CModal
              visible={deleteModal}
              onClose={() => {
                setDeleteModal(false)
                setSelectedFacility({})
                setIsConfirmDelete(false)
              }}
            >
              <CModalHeader>
                <CModalTitle>Confirm Deletion</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <p>Are you sure you want to delete this facility?</p>
                <br />
                <p>
                  <strong>Facility Name: </strong> <small>{selectedFacility.name}</small>
                </p>
                <p>
                  <strong>Facility Type: </strong> <small>{selectedFacility.type}</small>
                </p>
                <CAlert color="danger">
                  <p>
                    <strong>Warning: </strong>
                    <small>
                      Be aware that this action is irreversible. Once you delete this facility, you
                      will not be able to recover it. This actions will also delete all the
                      associated information with this facility such as events, timeslots,
                      reservations, etc.
                    </small>
                  </p>
                </CAlert>
              </CModalBody>
              <CModalFooter>
                <CForm>
                  <CFormCheck
                    type="checkbox"
                    label={
                      <span onClick={() => setIsConfirmDelete(!isConfirmDelete)}>
                        I understand the consequences of this action
                      </span>
                    }
                    onChange={() => setIsConfirmDelete(!isConfirmDelete)}
                    defaultChecked={isConfirmDelete}
                  />
                </CForm>
                <CButton
                  color="danger"
                  onClick={() => {
                    handleDelete(selectedFacility._id)
                    setDeleteModal(false)
                  }}
                  disabled={!isConfirmDelete}
                >
                  Delete
                </CButton>
              </CModalFooter>
            </CModal>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <FacilityForm
              isVisible={isFormVisible}
              onClose={() => {
                setIsFormVisible(false)
                setFacilityData({})
                getAllFacilitiesData()
              }}
              isEdit={isEdit}
              facilityData={facilityData}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <ManageFacilityForm
              isVisible={isManageFacilityFormVisible}
              onClose={() => {
                setIsManageFacilityFormVisible(false)
                setFacilityData({})
                getAllFacilitiesData()
              }}
              facilityData={facilityData}
              onChange={() => getAllFacilitiesData()}
            />
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default Facilities
