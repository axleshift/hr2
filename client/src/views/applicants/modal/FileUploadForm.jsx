import React, { useState, useContext } from 'react'
import { AuthContext } from '../../../context/authContext'
import propTypes from 'prop-types'
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
  CButton,
  CAlert,
  CSpinner,
} from '@coreui/react'
import { post } from '../../../api/axios'
import { AppContext } from '../../../context/appContext'

const FileUploadForm = ({ isVisible, onClose, docCategory, applicantData }) => {
  const { addToast } = useContext(AppContext)
  const { userInformation } = useContext(AuthContext)

  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  }

  // Handle file upload
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedFile) {
      addToast('Error', 'Please select a file to upload.', 'danger')
      return
    }

    setIsLoading(true)

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('category', docCategory)
    formData.append('applicant_Id', applicantData._id)
    formData.append('author_Id', userInformation._id)

    try {
      const res = await post('/document/upload', formData)

      if (res.status === 200 || res.status === 201) {
        addToast('Success', 'File uploaded successfully.', 'success')
        setSelectedFile(null)
        onClose()
      }
    } catch (error) {
      addToast('Error', 'Failed to upload the file. Please try again later.', 'danger')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CModal visible={isVisible} size="lg" onClose={onClose} backdrop="static">
      <CModalHeader>
        <CModalTitle>Upload Document</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit}>
          <CContainer>
            <CRow className="mb-3">
              <CCol>
                <CFormLabel htmlFor="fileInput">Select File</CFormLabel>
                <CFormInput
                  type="file"
                  id="fileInput"
                  onChange={handleFileChange}
                  required
                />
              </CCol>
            </CRow>

            {isLoading && (
              <CRow className="mb-3">
                <CCol className="d-flex justify-content-center">
                  <CSpinner size="sm" />
                  <span className="ms-2">Uploading...</span>
                </CCol>
              </CRow>
            )}

            <CRow className="d-flex justify-content-end">
              <CCol>
                <CButton
                  color="secondary"
                  onClick={onClose}
                  className="me-2"
                >
                  Close
                </CButton>
                <CButton
                  type="submit"
                  color="primary"
                  disabled={isLoading || !selectedFile}
                >
                  Upload
                </CButton>
              </CCol>
            </CRow>
          </CContainer>
        </CForm>
      </CModalBody>
    </CModal>
  )
}

FileUploadForm.propTypes = {
  isVisible: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
  docCategory: propTypes.string.isRequired,
  applicantData: propTypes.object.isRequired,
}

export default FileUploadForm
