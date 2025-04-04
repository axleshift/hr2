import React, { useState, useEffect, useContext, use } from 'react'
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
  CFormFeedback,
  CFormSelect,
  CTooltip,
} from '@coreui/react'
import { set, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { get, post, put } from '../../../api/axios'
import { AppContext } from '../../../context/appContext'
import { formatDate } from '../../../utils'

const OFFER_STATUSES = ['Pending', 'Accepted', 'Declined']

const jobofferSchema = z.object({
  position: z.string().min(1).max(30),
  salary: z.coerce.number().min(1).default(1),
  startDate: z.date(),
  benefits: z.string().optional(),
  status: z.enum(OFFER_STATUSES),
  notes: z.string().optional(),
})

const JobOfferForm = ({ isVisible, onClose, state, interview }) => {
  const { addToast } = useContext(AppContext)
  const { userInformation } = useContext(AuthContext)

  const [isConfirmed, setIsConfirmed] = useState(false)

  const [isReadOnly, setIsReadOnly] = useState(false)
  const [formState, setFormState] = useState('view')
  const [isFormVisible, setIsFormVisible] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: async (data, context, options) => {
      const result = await zodResolver(jobofferSchema)(data, context, options)
      console.log('Validation result:', result)
      return result
    },
  })

  const jobofferSubmit = async (data) => {
    console.log(JSON.stringify(data, null, 2))
  }

  useEffect(() => {
    if (isVisible) {
      setIsFormVisible(isVisible)
      setFormState(state)

      console.log('Interview', JSON.stringify(interview, null, 2))

      reset({
        position: interview.job ? interview.job : 'No Data',
        startDate: new Date(interview.date).toISOString().split('T')[0],
        salary: interview.salaryExpectation,
      })
    }
  }, [isVisible, state, interview])

  return (
    <CModal
      visible={isFormVisible}
      size="lg"
      onClose={() => {
        onClose()
        setIsFormVisible(false)
      }}
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle className="text-capitalize">Job Offer Form</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol>
            <CForm onSubmit={handleSubmit(jobofferSubmit)}>
              <CRow className="mb-3">
                <CCol>
                  <CFormInput
                    label="Position / job Applied For?"
                    {...register('position')}
                    invalid={!!errors.position}
                    readOnly={isReadOnly}
                  />
                  {errors.position && (
                    <CFormFeedback invalid>{errors.position.message}</CFormFeedback>
                  )}
                </CCol>
                <CCol>
                  <CFormInput
                    type="number"
                    label="Salary"
                    {...register('salary', { valueAsNumber: true })}
                    invalid={!!errors.salary}
                    readOnly={isReadOnly}
                  />
                  {errors.salary && <CFormFeedback invalid>{errors.salary.message}</CFormFeedback>}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <CTooltip placement="top" content="When the new hire is expected to start.">
                    <CFormLabel>Start Date</CFormLabel>
                  </CTooltip>

                  <CFormInput
                    type="date"
                    {...register('startDate', { valueAsDate: true })}
                    readOnly={isReadOnly}
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                  {errors.startDate && (
                    <CFormFeedback invalid>{errors.startDate.message}</CFormFeedback>
                  )}
                </CCol>
                <CCol>
                  <CFormSelect
                    label="Job Offer Status"
                    {...register('status')}
                    invalid={!!errors.status}
                    disabled
                  >
                    {OFFER_STATUSES.map((o, index) => {
                      return (
                        <option key={index} value={o}>
                          {o}
                        </option>
                      )
                    })}
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <CFormTextarea
                    label="Benefits"
                    rows={6}
                    {...register('benefits')}
                    readOnly={isReadOnly}
                  />
                  {errors.benefits && (
                    <CFormFeedback invalid>{errors.benefits.message}</CFormFeedback>
                  )}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <CFormTextarea
                    label="Notes"
                    rows={6}
                    {...register('notes')}
                    readOnly={isReadOnly}
                  />
                  {errors.notes && <CFormFeedback invalid>{errors.notes.message}</CFormFeedback>}
                </CCol>
              </CRow>
              <CRow>
                <CCol className="d-flex justify-content-end">
                  <CFormCheck
                    label="I confirm that details above are correct and true."
                    defaultChecked={!isConfirmed}
                    onChange={() => setIsConfirmed(!isConfirmed)}
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol className="d-flex justify-content-end">
                  <CButton type="submit" color="primary" size="sm" disabled={isConfirmed}>
                    Issue Job Offer
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCol>
        </CRow>
      </CModalBody>
    </CModal>
  )
}

JobOfferForm.propTypes = {
  isVisible: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
  state: propTypes.string.isRequired,
  interview: propTypes.object,
  joboffer: propTypes.object,
}

export default JobOfferForm
