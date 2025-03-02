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
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { get, post, put, del } from '../../../api/axios'

const TemplateForm = () => {
	return (
		<>
			<CModal>
				<CModalHeader>
					<CModalTitle>
						Template Form
					</CModalTitle>
				</CModalHeader>
				<CModalBody>
					<CContainer>
						<CRow>
							<CCol>
								<CForm>
									<CRow>
										<CCol>
											<CFormLabel>
												Fullname
											</CFormLabel>
											<CFormInput />
										</CCol>
									</CRow>
									<CRow>
										<CCol>
											<CFormLabel>
												Email
											</CFormLabel>
											<CFormInput />
										</CCol>
									</CRow>
									<CRow>
										<CCol>
											<CFormLabel>
												Phone Number
											</CFormLabel>
											<CFormInput />
										</CCol>
									</CRow>
									<CRow>
										<CCol>
											<CFormLabel>
												Position
											</CFormLabel>
											<CFormInput />
										</CCol>
									</CRow>
									<CRow>
										<CCol>
											<CFormLabel>
												Date
											</CFormLabel>
											<CFormInput />
										</CCol>
									</CRow>
									<CRow>
										<CCol>
											<CFormLabel>
												Time
											</CFormLabel>
											<CFormInput />
										</CCol>
									</CRow>
									<CRow>
										<CCol>
											<CFormLabel>
												Note
											</CFormLabel>
											<CFormTextarea />
										</CCol>
									</CRow>
									<CRow>
										<CCol>
											<CButton>
												Save
											</CButton>
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