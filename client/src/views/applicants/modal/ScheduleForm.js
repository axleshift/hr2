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
	CFormSelect,
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
import { get, post, put, del } from '../../../api/axios'
import { AppContext } from '../../../context/appContext'

const ScheduleForm = ({ isVisible, onClose, isDarkMode, applicantData }) => {
	const { addToast } = useContext(AppContext)

	const [facilities, setFacilities] = useState([])
	const [selectedFacility, setSelectedFacility] = useState('')

	const getAllFacilities = async () => {
		try {
			const res = await get('/facilities/all')
			console.log(res.data)
			setFacilities(res.data.data)
		} catch (error) {
			addToast('error', error.message, 'Error')
		}
	}

	useEffect(() => {
		getAllFacilities()
	}, [])
	return (
		<>
			<CModal visible={isVisible}
				onClose={() => {
					onClose()
					setSelectedFacility('')
				}}
				size='xl'
				backdrop="static"
			>
				<CModalHeader>
					<CModalTitle>
						Schedule Form
					</CModalTitle>
				</CModalHeader>
				<CModalBody>
					<CForm>
						<CContainer>
							<CRow className="mb-2" xs={{ cols: 1, gutter: 2 }} md={{ cols: 2, gutter: 4 }}>
								<CCol>
									<CFormSelect>
										<option value="">Select Facility</option>
										{facilities.map((facility) => (
											<option key={facility._id} value={facility._id} onClick={() => setSelectedFacility(facility)}>
												{facility.name}
											</option>
										))}
									</CFormSelect>
								</CCol>
								<CCol>
									<p className="text-muted">
										{selectedFacility ? (
											<>
												<strong>{selectedFacility.location} </strong>
												<br />
												{selectedFacility.description}
											</>
										) : (
											'Please select a facility'
										)}
									</p>
								</CCol>
							</CRow>
							<CRow>
							</CRow>
						</CContainer>
					</CForm>
				</CModalBody>
			</CModal>
		</>
	)
}

ScheduleForm.propTypes = {
	isVisible: propTypes.bool.isRequired,
	isDarkMode: propTypes.bool,
	onClose: propTypes.func.isRequired,
	applicantData: propTypes.object,
}

export default ScheduleForm