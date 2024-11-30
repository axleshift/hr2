import {
  CContainer,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalBody,
  CBadge,
  CForm,
  CFormInput,
  CFormText,
  CFormTextarea,
  CInputGroupText,
  CInputGroup,
  CFormLabel,
  CButton,
  CTooltip,
} from '@coreui/react'
import PropTypes from 'prop-types'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { faPaperPlane, faPlus } from '@fortawesome/free-solid-svg-icons'

const Compose = () => {
  return (
    <>
      <CContainer>
        <CRow className="mb-3">
          <CCol>
            <h2>Compose</h2>
            <small>
              In this page, you can compose a new email and send it to the recipients. You can also add
              multiple recipients by clicking the plus button.
            </small>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol>
            <CForm>
              <CRow className="mb-3">
                <CCol>
                  <CFormLabel htmlFor="to">To:</CFormLabel>
                  <CInputGroup>
                    <CFormInput type="email" id="to" />
                    <CButton color="primary">
                      <FontAwesomeIcon icon={faPlus} />
                    </CButton>
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <CFormLabel htmlFor="subject">Subject:</CFormLabel>
                  <CFormInput type="text" id="subject" />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <CFormLabel htmlFor="content">Content:</CFormLabel>
                  <CFormTextarea id="content" rows="5" />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <div className="d-flex justify-content-end">
                    <CButton color="primary">
                      <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                      Send
                    </CButton>
                  </div>
                </CCol>
              </CRow>
            </CForm>
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default Compose
