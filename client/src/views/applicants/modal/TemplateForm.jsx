import React from 'react'
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CButton,
} from '@coreui/react'

const TemplateForm = () => {
  return (
    <>
      <CModal>
        <CModalHeader>
          <CModalTitle>Template Form</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <CRow>
              <CCol>
                <CForm>
                  <CRow>
                    <CCol>
                      <CFormLabel>Fullname</CFormLabel>
                      <CFormInput />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CFormLabel>Email</CFormLabel>
                      <CFormInput />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CFormLabel>Phone Number</CFormLabel>
                      <CFormInput />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CFormLabel>Position</CFormLabel>
                      <CFormInput />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CFormLabel>Date</CFormLabel>
                      <CFormInput />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CFormLabel>Time</CFormLabel>
                      <CFormInput />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CFormLabel>Note</CFormLabel>
                      <CFormTextarea />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CButton>Save</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCol>
            </CRow>
          </CContainer>
        </CModalBody>
      </CModal>
    </>
  )
}

export default TemplateForm
