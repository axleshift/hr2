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
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const MailForm = ({ isVisible, mailData, onClose }) => {
  const [isDraftFormVisible, setDraftFormVisible] = React.useState(false)
  const [isRecipientVisible, setRecipientVisible] = React.useState(false)
  const [recipient, setRecipient] = React.useState(null)

  const handleDraftFormClose = () => {
    setDraftFormVisible(false)
    onClose()
  }

  const handleAddRecipient = (data) => {
    setRecipient((prev) => [...prev, data])
  }

  const handleRemoveReceipient = (data) => {
    setRecipient((prev) => prev.filter((item) => item !== data))
  }

  React.useEffect(() => {
    setDraftFormVisible(isVisible)
    setRecipient(mailData?.to.map((to) => to).join(', '))
  }, [mailData])

  return (
    <>
      <CModal size="xl" visible={isDraftFormVisible} onClose={handleDraftFormClose}>
        <CModalHeader>
          <span>
            <strong>Draft:</strong> {mailData?.subject}
          </span>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol>
                <small>From: </small>
                <CInputGroup>
                  <CFormInput type="text" value="hr2axleshift@gmail.com" readOnly />
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <small>To:</small>
                <CInputGroup>
                  <CFormInput type="text" defaultValue={recipient} readOnly />
                  <CButton
                    onClick={() => {
                      setDraftFormVisible(false)
                      setRecipientVisible(true)
                      console.log('Add recipient')
                    }}
                    className="btn btn-primary"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </CButton>
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <small>Subject:</small>
                <CInputGroup>
                  <CFormInput type="text" defaultValue={mailData?.subject} />
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <small>Content:</small>
                <CFormTextarea
                  defaultValue={mailData?.content}
                  className="scalableCFormTextArea-200"
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <div className="d-flex justify-content-end">
                  <CButton className="btn btn-primary">Save</CButton>
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
      </CModal>

      <CModal
        visible={isRecipientVisible}
        onClose={() => {
          setDraftFormVisible(true)
          setRecipientVisible(false)
        }}
      >
        <CModalHeader>Add Recipient</CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol>
                <small>Recipient:</small>
                <CInputGroup>
                  <CFormInput type="text" placeholder="Enter recipient email" />
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <div className="d-flex justify-content-end">
                  <CButton className="btn btn-primary">Add</CButton>
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

MailForm.propTypes = {
  isVisible: PropTypes.bool,
  mailData: PropTypes.object,
  onClose: PropTypes.func,
}

export default MailForm
