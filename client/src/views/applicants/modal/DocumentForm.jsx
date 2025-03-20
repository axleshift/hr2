import React, { useState, useEffect, useContext } from 'react'
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
  CFormTextarea,
  CInputGroup,
  CButton,
  CBadge,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CCard,
  CCardBody,
  CTabs,
  CTab,
  CTabList,
  CTabContent,
  CTabPanel,
  CFormCheck,
  CAlert,
} from '@coreui/react'
import { set, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { get, post, put } from '../../../api/axios'
import { AppContext } from '../../../context/appContext'
import { formatDate } from '../../../utils'

const DocumentForm = ({ isVisible, onClose, applicantData, docCategory }) => {
  const { addToast } = useContext(AppContext)
  const { userInformation } = useContext(AuthContext)

  // Form State
  const [isTagLoading, setIsTagLoading] = useState(true)
  const [formTags, setFormTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [charLimit, setCharLimit] = useState(500)
  const [charCount, setCharCount] = useState(0)
  const [isEdit, setIsEdit] = useState(false)
  const [isFormChecked, setIsFormChecked] = useState(false)

  // History State
  const [documentHistory, setDocumentHistory] = useState([])
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)

  // Tabs state
  const [activeTab, setActiveTab] = useState('form')

  const formSchema = z.object({
    document_id: z.string().optional(),
    author_Id: z.string().min(1).max(255),
    authorName: z.string().min(1).max(255),
    applicant_Id: z.string().min(1).max(255),
    applicantName: z.string().min(1).max(255),
    title: z.string().min(1).max(255),
    content: z.string().min(1).max(500),
  })

  const {
    register,
    handleSubmit,
    reset: formReset,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
  })

  const handleSubmitForm = async (data) => {
    try {
      // console.log(data)
      setIsLoading(true)

      const formData = new FormData()
      formData.append('category', docCategory)
      formData.append('author_Id', userInformation._id)
      formData.append('applicant_Id', data.applicant_Id)
      formData.append('title', data.title)
      formData.append('content', data.content)
      formData.append(
        'tags',
        selectedTags.map((tag) => tag._id),
      )

      console.log(formData)

      const res = isEdit
        ? await put(`/document/update/${data.document_id}`, formData)
        : await post('/document/create', formData)

      console.log(res)

      if (res.status === 200 || res.status === 201) {
        addToast('Success', 'Document Created Successfully', 'success')
        formReset({
          author_Id: userInformation._id,
          authorName: `${userInformation.lastname}, ${userInformation.firstname}`,
          applicant_Id: '',
          title: '',
          content: '',
        })
        setSelectedTags([])
        onClose()
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
      addToast('Error', error, 'danger')
    }
  }

  const handleViewScreening = async (screeningID) => {
    try {
      setIsEdit(true)
      const res = documentHistory.find((item) => item._id === screeningID)
      if (!res) {
        return addToast('Error', 'Screening not found', 'danger')
      }

      // set form data
      formReset({
        document_id: res._id,
        author_Id: res.author_Id,
        authorName: res.authorName,
        applicant_Id: res.applicant_Id,
        applicantName: res.applicantName,
        title: res.title,
        content: res.content,
      })

      // setSelectedTags(res.tags)
      // console.log("selectedTags", selectedTags)

      setActiveTab('form')
      return addToast(
        'Success',
        'Screening loaded successfully. Switch to Form Tab to view.',
        'success',
      )
    } catch (error) {
      console.log(error)
      addToast('Error', error.message, 'danger')
    }
  }

  const handleReset = () => {
    setIsEdit(false)
    formReset({
      author_Id: userInformation._id,
      authorName: `${userInformation.lastname}, ${userInformation.firstname}`,
      applicant_Id: applicantData._id,
      applicantName: `${applicantData.lastname}, ${applicantData.firstname}`,
      title: '',
      content: '',
    })
    setSelectedTags([])
    setIsFormChecked(false)
  }

  const getApplicantScreeningHistory = async () => {
    try {
      setIsHistoryLoading(true)
      const res = await get(`/document/applicant/${applicantData._id}/${docCategory}`)
      console.log(res)
      if (res.status === 404) {
        addToast('Error', 'No history found', 'danger')
        setIsHistoryLoading(false)
        return
      }

      if (res.status === 200) {
        // console.log(res.data.documents)
        setDocumentHistory(res.data.documents)
        setIsHistoryLoading(false)
      }
      setIsHistoryLoading(false)
    } catch (error) {
      console.log(error)
      addToast('Error', error, 'danger')
      setIsHistoryLoading(false)
    }
  }

  const getAllTagOptions = async () => {
    try {
      setIsTagLoading(true)
      const category = 'document'
      const res = await get(`/tags/category/${category}`)
      if (res.status === 404) {
        return addToast('Error', res.message.message, 'danger')
      }
      if (res.status === 200) {
        console.log(res.data.data)
        setFormTags(res.data.data)
      }
    } catch (error) {
      addToast('Error', error, 'danger')
    }
  }

  const handleTagChange = (tagID) => {
    const tag = formTags.find((tag) => tag._id === tagID)
    if (selectedTags.some((item) => item._id === tag._id)) {
      setSelectedTags((prev) => prev.filter((item) => item._id !== tag._id))
    } else {
      setSelectedTags((prev) => [...prev, tag])
    }
  }

  const handleOnClose = () => {
    onClose()
    setIsEdit(false)
  }

  useEffect(() => {
    if (isVisible) {
      getAllTagOptions()
      getApplicantScreeningHistory()
      formReset({
        author_Id: `${userInformation.lastname}, ${userInformation.firstname}`,
        authorName: `${userInformation.lastname}, ${userInformation.firstname}`,
        applicant_Id: applicantData._id,
        applicantName: `${applicantData.lastname}, ${applicantData.firstname}`,
        title: `${applicantData.lastname}, ${applicantData.firstname} - ${docCategory} ${formatDate(new Date(), 'MMM DD, YYYY')}`,
        content: '',
      })
    }
  }, [isVisible, userInformation, applicantData, formReset])

  useEffect(() => {
    const subscription = watch((value) => setCharCount(value.content?.length || 0))
    return () => subscription.unsubscribe()
  }, [watch])

  return (
    <CModal visible={isVisible} size="lg" onClose={handleOnClose} backdrop="static">
      <CModalHeader>
        <CModalTitle className="text-capitalize">{docCategory} Form</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CTabs activeItemKey={activeTab} onActiveItemChange={(key) => setActiveTab(key)}>
          <CTabList variant="underline-border">
            <CTab itemKey="form">Form</CTab>
            <CTab itemKey="history">History</CTab>
          </CTabList>
          <CTabContent>
            <CTabPanel itemKey="form">
              <CForm onSubmit={handleSubmit(handleSubmitForm)}>
                <CContainer>
                  <CRow>
                    <CCol>
                      <CFormInput type="hidden" id="document_id" {...register('document_id')} />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CFormInput
                        type="hidden"
                        {...register('author_Id')}
                        invalid={!!errors.author_Id}
                        readOnly
                      />
                      {errors.author && (
                        <div className="invalid-feedback">{errors.author.message}</div>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3 mt-3">
                    <CCol>
                      <CFormInput
                        type="text"
                        id="authorName"
                        placeholder="Author Name"
                        label="Author Name"
                        {...register('authorName')}
                        invalid={!!errors.authorName}
                        readOnly
                      />
                      {errors.authorName && (
                        <div className="invalid-feedback">{errors.authorName.message}</div>
                      )}
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CFormInput
                        type="hidden"
                        {...register('applicant_Id')}
                        invalid={!!errors.applicant_Id}
                        readOnly
                      />
                      {errors.applicant_Id && (
                        <div className="invalid-feedback">{errors.applicant_Id.message}</div>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol>
                      <CFormInput
                        type="text"
                        id="applicantName"
                        placeholder="Applicant Name"
                        label="Applicant Name"
                        {...register('applicantName')}
                        invalid={!!errors.applicantName}
                        readOnly
                      />
                      {errors.applicantName && (
                        <div className="invalid-feedback">{errors.applicantName.message}</div>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol>
                      <CFormInput
                        type="text"
                        id="title"
                        placeholder="Title"
                        label="Title"
                        {...register('title')}
                        invalid={!!errors.title}
                      />
                      {errors.title && (
                        <div className="invalid-feedback">{errors.title.message}</div>
                      )}
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CFormTextarea
                        id="content"
                        placeholder="Candidate is good/bad fit for the role because..."
                        label="Content"
                        rows={3}
                        {...register('content')}
                        invalid={!!errors.content}
                      />
                      {errors.content && (
                        <div className="invalid-feedback">{errors.content.message}</div>
                      )}
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol>
                      <small className={charCount >= charLimit ? 'text-danger' : 'text-muted'}>
                        {
                          // eslint-disable-next-line no-nested-ternary
                          charCount >= charLimit
                            ? `Maximum of ${charLimit} characters.`
                            : charCount === 0
                              ? 'Minimum of 1 character.'
                              : `${charCount} / ${charLimit} characters`
                        }
                      </small>
                    </CCol>
                  </CRow>
                  {/* <CRow className="mb-3">
                    <CCol>
                      <CFormLabel>Tags</CFormLabel>
                      <CRow>
                        {formTags.map((tag) => {
                          return (
                            <CCol key={tag._id} xs="auto">
                              <CInputGroup>
                                <CBadge
                                  onClick={() => {
                                    handleTagChange(tag._id)
                                  }}
                                  className={
                                    selectedTags.some((item) => item._id === tag._id)
                                      ? 'btn btn-primary'
                                      : 'btn btn-outline-primary'
                                  }
                                  style={{
                                    cursor: 'pointer',
                                  }}
                                >
                                  {tag.name}
                                </CBadge>
                              </CInputGroup>
                            </CCol>
                          )
                        })}
                      </CRow>
                    </CCol>
                  </CRow> */}
                  <CRow className="mb-3">
                    <CCol className="d-flex justify-content-end">
                      <CFormCheck
                        type="checkbox"
                        defaultChecked={isFormChecked}
                        label="I confirm that the information provided is accurate."
                        onChange={() => setIsFormChecked(!isFormChecked)}
                      />
                    </CCol>
                  </CRow>
                  {docCategory === 'screening' && isFormChecked && (
                    <CRow>
                      <CCol>
                        <CAlert color="info" variant="outline" dismissible>
                          <p>
                            Note that if you <strong>confirm</strong> the applicant, the applicant
                            will be moved to the next stage of the recruitment process. Which is{' '}
                            <strong>shortlisting</strong>. This means that the applicant will be
                            considered for the job.
                          </p>
                          <hr />
                          <p>
                            <small>
                              If applicant is already shortlisted this action will just create a new
                              screening document, which can be viewed in the history tab.
                            </small>
                          </p>
                        </CAlert>
                      </CCol>
                    </CRow>
                  )}
                  <CRow>
                    <CCol className="d-flex justify-content-end">
                      {isEdit && (
                        <CButton color="danger" className="me-2" onClick={() => handleReset()}>
                          Reset
                        </CButton>
                      )}
                      <CButton type="submit" color="primary" disabled={!isFormChecked}>
                        {isEdit ? 'Update' : 'Create'}
                      </CButton>
                    </CCol>
                  </CRow>
                </CContainer>
              </CForm>
            </CTabPanel>
            <CTabPanel itemKey="history">
              <CContainer>
                <CRow className="mb-3 mt-3">
                  <CCol>
                    {isHistoryLoading ? (
                      <div className="text-center">Loading...</div>
                    ) : (
                      <CTable align="middle" hover responsive striped>
                        <CTableHead>
                          <CTableRow>
                            {/* <CTableHeaderCell className="text-center">#</CTableHeaderCell> */}
                            <CTableHeaderCell>Author</CTableHeaderCell>
                            <CTableHeaderCell>Title</CTableHeaderCell>
                            <CTableHeaderCell>Created At</CTableHeaderCell>
                            <CTableHeaderCell>Updated At</CTableHeaderCell>
                            <CTableHeaderCell>Actions</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {documentHistory.map((doc, index) => (
                            <CTableRow key={index}>
                              {/* <CTableDataCell>{doc._id}</CTableDataCell> */}
                              <CTableDataCell>{doc.authorName}</CTableDataCell>
                              <CTableDataCell>{doc.title}</CTableDataCell>
                              <CTableDataCell>
                                {formatDate(doc.createdAt, 'MMM DD, YYYY - h:m A')}
                              </CTableDataCell>
                              <CTableDataCell>
                                {formatDate(doc.updatedAt, 'MMM DD, YYYY - h:m A')}
                              </CTableDataCell>
                              <CTableDataCell>
                                <CButton
                                  color="primary"
                                  size="sm"
                                  onClick={() => handleViewScreening(doc._id)}
                                >
                                  View
                                </CButton>
                              </CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    )}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <div className="d-flex justify-content-end">
                      <CButton color="primary" onClick={getApplicantScreeningHistory}>
                        Reload
                      </CButton>
                    </div>
                  </CCol>
                </CRow>
              </CContainer>
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </CModalBody>
    </CModal>
  )
}

DocumentForm.propTypes = {
  isVisible: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
  applicantData: propTypes.object.isRequired,
  docCategory: propTypes.string.isRequired,
}

export default DocumentForm
