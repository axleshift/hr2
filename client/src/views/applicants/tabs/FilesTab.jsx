import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { CContainer, CListGroup, CListGroupItem, CButton, CSpinner } from '@coreui/react'
import PdfViewerModal from '../../../components/PDFViewerModal'
import { post } from '../../../api/axios'

const FilesTab = ({ applicantId, files = [], interviews = [] }) => {
  const [selectedFileType, setSelectedFileType] = useState(null)
  const [viewerVisible, setViewerVisible] = useState(false)
  const [loadingKey, setLoadingKey] = useState(null)
  const [allFiles, setAllFiles] = useState({ ...files, ...interviews }) // Manage state locally
  const fileInputRef = useRef()

  // Human-friendly labels
  const fileLabels = {
    resume: 'Resume',
    medCert: 'Medical Certificate',
    birthCert: 'Birth Certificate',
    NBIClearance: 'NBI Clearance',
    policeClearance: 'Police Clearance',
    TOR: 'Transcript of Record (TOR)',
    idPhoto: 'Identification Photo',
    InitialInterview: 'Initial Interview',
    TechnicalInterview: 'Technical Interview',
    PanelInterview: 'Panel Interview',
    BehavioralInterview: 'Behavioral Interview',
    FinalInterview: 'Final Interview',
  }

  const validFileKeys = [
    'resume',
    'medCert',
    'birthCert',
    'NBIClearance',
    'policeClearance',
    'TOR',
    'idPhoto',
  ]
  const validInterviewKeys = [
    'InitialInterview',
    'TechnicalInterview',
    'PanelInterview',
    'BehavioralInterview',
    'FinalInterview',
  ]

  const handleOpen = (fileType) => {
    if (!allFiles[fileType]) return
    setLoadingKey(fileType)
    setTimeout(() => {
      setSelectedFileType(fileType)
      setViewerVisible(true)
      setLoadingKey(null)
    }, 200)
  }

  const handleUploadClick = (key) => {
    fileInputRef.current.dataset.fileType = key
    fileInputRef.current.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    const fileType = e.target.dataset.fileType
    if (!file || !fileType) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      setLoadingKey(fileType)
      // Upload the file via the axios POST method
      const res = await post(`/applicant/file/${applicantId}/interview/${fileType}`, formData)

      if (res.status === 200) {
        console.log(res.data)
        // Assuming the file name or URL is returned
        setAllFiles((prevFiles) => ({
          ...prevFiles,
          [fileType]: file.name, // You can replace with file URL if needed
        }))
      } else {
        alert('Upload failed')
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Upload failed')
    } finally {
      setLoadingKey(null)
      e.target.value = null
    }
  }

  const handleClose = () => {
    setViewerVisible(false)
    setSelectedFileType(null)
  }

  return (
    <>
      <CContainer className="mt-3">
        <CListGroup>
          {Object.entries(fileLabels).map(([key, label]) => (
            <CListGroupItem key={key} className="d-flex justify-content-between align-items-center">
              <span>{label}</span>

              {validFileKeys.includes(key) ? (
                <CButton
                  color={files[key] ? 'info' : 'secondary'}
                  size="sm"
                  disabled={!files[key] || loadingKey === key}
                  onClick={() => handleOpen(key)}
                >
                  {loadingKey === key ? (
                    <>
                      <CSpinner size="sm" /> <span>Loading...</span>
                    </>
                  ) : files[key] ? (
                    'View'
                  ) : (
                    'No File'
                  )}
                </CButton>
              ) : validInterviewKeys.includes(key) ? (
                loadingKey === key ? (
                  <CSpinner size="sm" />
                ) : interviews[key] ? (
                  <div className="d-flex gap-2">
                    <CButton color="info" size="sm" onClick={() => handleOpen(key)}>
                      View
                    </CButton>
                    <CButton color="warning" size="sm" onClick={() => handleUploadClick(key)}>
                      Reupload
                    </CButton>
                  </div>
                ) : (
                  <CButton color="primary" size="sm" onClick={() => handleUploadClick(key)}>
                    Upload
                  </CButton>
                )
              ) : null}
            </CListGroupItem>
          ))}
        </CListGroup>
      </CContainer>

      <input ref={fileInputRef} type="file" hidden onChange={handleFileChange} />

      {selectedFileType && (
        <PdfViewerModal
          isVisible={viewerVisible}
          onClose={handleClose}
          url={`/applicant/${applicantId}/file/${selectedFileType}`}
          width={800}
        />
      )}
    </>
  )
}

FilesTab.propTypes = {
  applicantId: PropTypes.string.isRequired,
  files: PropTypes.object.isRequired,
  interviews: PropTypes.object.isRequired,
}

export default FilesTab
