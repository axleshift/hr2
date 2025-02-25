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
} from '@coreui/react'

import React, { useContext, useEffect } from 'react'
import { AppContext } from '../../context/appContext'
import { get } from '../../api/axios'
import FacilityForm from './modals/FacilityForm'

const Facilities = () => {
  const { addToast } = useContext(AppContext)
  const [facilities, setFacilities] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')

  // form state
  const [isFormVisible, setIsFormVisible] = React.useState(false)
  const [facilityData, setFacilityData] = React.useState({})
  const [isEdit, setIsEdit] = React.useState(false)

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
            </div>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CContainer>
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
                              <CButton color="danger" size="sm" className="ms-2">
                                Delete
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </CCardBody>
                </CCard>
              )}
            </CContainer>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <FacilityForm
              isVisible={isFormVisible}
              onClose={() => setIsFormVisible(false)}
              isEdit={isEdit}
              facilityData={facilityData}
            />
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default Facilities
