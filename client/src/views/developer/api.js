import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CButton,
  CTooltip,
  CFormFeedback,
  CInputGroupText,
} from '@coreui/react'
import React from 'react'
import { AppContext } from '../../context/appContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const API = () => {
  const { addToast } = React.useContext(AppContext)
  const [apiKey, setApiKey] = React.useState('')

  const handleGenerateAPIKey = () => {
    const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let key = ''
    for (let i = 0; i < 64; i++) {
      key += char.charAt(Math.floor(Math.random() * char.length))
    }
    setApiKey(key)
  }

  const handleCopyAPIKey = () => {
    navigator.clipboard.writeText(apiKey)
    addToast('success', 'API Key copied to clipboard', 'success')
  }

  const formSchema = z.object({
    description: z.string().min(1).max(255),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  })

  return (
    <>
      <CContainer>
        <CForm onSubmit={handleSubmit(handleGenerateAPIKey)}>
          <CRow className="mb-3">
            <CCol>
              <h1>API</h1>
              <small className="text-muted">
                In this page, you can generate an API key for your application.
              </small>
            </CCol>
          </CRow>
          <CRow>
            <CCol className="mb-3">
              <CInputGroup className="mb-3">
                <CFormInput type="text" placeholder="API Key" defaultValue={apiKey} readOnly />
                {apiKey && (
                  <CButton color="success" onClick={handleCopyAPIKey}>
                    Copy
                    <FontAwesomeIcon icon={faClipboard} className='mx-2'/> 
                  </CButton>
                )}
              </CInputGroup>
              <CInputGroup>
                <CFormInput
                  type="text"
                  placeholder="Description"
                  {...register('description')}
                  invalid={!!errors.description}
                />
                <CButton type="submit" color="primary">
                  Generate
                </CButton>
                {/* {errors.description && (
                  <CFormFeedback invalid>{errors.description.message}</CFormFeedback>
                )} */}
              </CInputGroup>
            </CCol>
            <CCol>
              <small className="text-muted">
                Click the generate button to generate a new API key. Click the copy button to copy
                the API key to your clipboard. Add a description to your API key to help you
                remember what it is used for. Take note that you can only use one API key at a time.
                if you generate a new API key, the old one will be replaced.
              </small>
            </CCol>
          </CRow>
        </CForm>
      </CContainer>
    </>
  )
}

export default API
