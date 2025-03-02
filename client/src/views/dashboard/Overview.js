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

const Overview = () => {
	return (
		<>
			<CContainer>
				<CRow>
					<CCol>
						<h1>Overview</h1>
						<small className="text-muted">In this page, you can see an overview of your application.</small>
					</CCol>
				</CRow>
			</CContainer></>
	)
}

export default Overview