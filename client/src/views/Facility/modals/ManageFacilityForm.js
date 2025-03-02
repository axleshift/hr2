import React, { useState, useEffect, useContext, use } from 'react'
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
import { date, set, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { get, post, put, del } from '../../../api/axios'

import { Calendar } from 'react-calendar'
import { AppContext } from '../../../context/appContext'
import { config } from '../../../config'
import { formatDate } from '../../../utils'

const ManageFacilityForm = ({ isVisible, onClose, facilityData = {} }) => {
	const { addToast } = useContext(AppContext)

	// Calendar state
	const [isDarkMode, setIsDarkMode] = useState(false)
	const [defaultDate, setDefaultDate] = useState(new Date())
	const [notAvailableDates, setNotAvailableDates] = useState([])
	const [hasEvents, setHasEvents] = useState([])

	const [Events, setEvents] = useState([])
	const [isEdit, setIsEdit] = useState(false)

	// Timeslots state
	const [timeSlots, setTimeSlots] = useState([])

	const handleDateChange = (date) => {
		// idk why but the date is off by 1 day
		// so we need to subtract the timezone offset
		// to get the correct date
		// THIS HAS BEEN DRIVING ME CRAZY AND I'M TOO CAFFEINATED TO THINK
		// SO I'M JUST GONNA DO THIS
		const formattedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
		setDefaultDate(formattedDate);
	}

	const formatTime = (time, format = "12h") => {
		// if time is 12 but format is 12h return 12h
		const twelveHrRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
		const twentyFourHrRegex = /^(1[012]|[1-9]):[0-5]\d\s[APap][mM]$/

		switch (format) {
			case "12h":
				if (twelveHrRegex.test(time)) {
					const [hours, minutes] = time.split(':')
					const suffix = hours >= 12 ? 'PM' : 'AM'
					const formattedHours = hours % 12 || 12
					return `${formattedHours}:${minutes} ${suffix}`
				}
				return time
			case "24h":
				if (twentyFourHrRegex.test(time)) {
					const [time, suffix] = time.split(' ')
					const [hours, minutes] = time.split(':')
					const formattedHours = hours === '12' ? '00' : hours
					return `${formattedHours}:${minutes}`
				}
				return time
			default:
				return time
		}
	}

	const getEventsForDate = async (date) => {
		try {
			const newDate = new Date(date)
			const res = await get(`facilities/events/${facilityData._id}/date/${newDate}`)
			console.log(res.data)
			if (res.status === 404) {
				return addToast('Error', res.message, 'danger')
			}
			setEvents(res.data.data)
		} catch (error) {
			addToast('Error', 'An error occurred', 'danger')
			console.error(error)
		}
	}

	const formSchema = z.object({
		name: z.string().min(3).max(255),
		description: z.string().optional(),
		date: z.string().refine((val) => !isNaN(Date.parse(val)), {
			message: "Invalid date format",
		}),
		// timeslots: z.array(z.object({
		// 	start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
		// 	end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
		// })),
	})

	const {
		register,
		handleSubmit,
		reset: formReset,
		formState: { errors } } = useForm({
			resolver: zodResolver(formSchema),
		})

	const handleSubmitEvent = async (data) => {
		try {
			const formattedData = {
				...data,
				date: new Date(data.date),
			}
			console.log('Formatted Data:', formattedData)
			const res = await post(`facilities/event/${facilityData._id}`, formattedData)
			if (res.status === 404) {
				return addToast('Error', 'An error occurred', 'danger')
			}
			console.log(res.data)
			addToast('Success', 'Event created successfully', 'success')

		} catch (error) {
			addToast('Error', 'An error occurred', 'danger')
			console.error(error)
		}
	}

	const timeSchema = z.object({
		start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
		end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
	}).superRefine((data, ctx) => {
		if (data.start >= data.end) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Start time must be before end time',
				path: ['start'], // This will highlight the 'start' field
			});
		}
		// Check for overlapping timeslots
		const overlappingSlot = timeSlots.find(slot =>
			(data.start < slot.end && data.end > slot.start)
		);
		if (overlappingSlot) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Timeslot overlaps with an existing one',
				path: ['start'], // This will highlight the 'start' field
			});
		}
	});

	const {
		register: timeFormRegister,
		handleSubmit: timeHandleSubmit,
		reset: timeFormReset,
		formState: { errors: timeErrors }
	} = useForm({
		// resolver: zodResolver(timeSchema),\
		// debug
		resolver: async (data, context, options) => {
			const result = await zodResolver(timeSchema)(data, context, options)
			console.log('Validation result:', result)
			return result
		},
	})

	const handleAddTimeslot = async (data) => {
		try {
			// push to timeslots
			setTimeSlots([...timeSlots, data]);
			// timeFormReset([...timeSlots, data]);
			addToast('Success', 'Timeslot added successfully', 'success');
			timeFormReset();
		} catch (error) {
			addToast('Error', 'An error occurred', 'danger');
			console.error(error);
		}
	};

	const handleRemoveTimeslot = (id) => {
		try {
			const newTimeSlots = timeSlots.filter((slot, i) => i !== id);
			setTimeSlots(newTimeSlots);
		} catch (error) {
			console.error(error);
		}
	}

	const handleResetForm = () => {
		formReset({
			name: '',
			description: '',
			date: new Date().toISOString().split('T')[0],
		});
		setTimeSlots([]);
	}

	const handleFillMockData = () => {
		formReset({
			name: 'Event Name',
			description: 'Event Description',
			date: new Date().toISOString().split('T')[0],
		})
	}

	useEffect(() => {
		getEventsForDate(defaultDate)
		// console.log('Default Date:', defaultDate)
	}, [defaultDate, timeSlots])

	return (
		<>
			<CModal visible={isVisible} onClose={onClose} size="lg" backdrop="static">
				<CModalHeader>
					<CModalTitle>
						Manage {facilityData.name || 'Facility'}
					</CModalTitle>
				</CModalHeader>

				<CModalBody>
					<CTabs activeItemKey="calendar">
						<CTabList variant='underline-border'>
							<CTab itemKey="calendar">Calendar</CTab>
							<CTab itemKey="form">Form</CTab>
						</CTabList>
						<CTabContent>
							<CTabPanel itemKey="calendar">
								<CContainer>
									{/* <CRow className='mb-3 mt-3'>
										<CCol>
											<CFormInput
												type='text'
												label='Facility Name'
												defaultValue={facilityData.name}
												readOnly
											/>
										</CCol>
									</CRow>
									<CRow className='mb-3'>
										<CCol>
										<CFormInput
												type='text'
												label='Facility Type'
												defaultValue={facilityData.type}
												readOnly
											/>
										</CCol>
									</CRow>
									<CRow>
										<CCol>
											<hr />
										</CCol>
									</CRow> */}
									<CRow className='mb-3'>
										<CCol>
											<div>
												{/* <CAlert dismissible color='info' className='mb-2 mt-2' >
													How to use the calendar:
													Select Date, then goto Form tab to create event
												</CAlert> */}
												<Calendar
													onChange={handleDateChange}
													className={isDarkMode ? 'calendar dark-mode' : 'calendar'}
													defaultValue={defaultDate}
												/>
											</div>
										</CCol>
									</CRow>
									<CRow className='mb-3'>
										<CCol>
											<CInputGroup>
												<CFormInput
													type='text'
													placeholder='Enter date'
													value={defaultDate}
													readOnly
												/>
												{/* <CButton
													color='primary'
												>
													Create Event
												</CButton> */}
											</CInputGroup>
										</CCol>
									</CRow>
									<CRow>
										<CCol>
											<CCard>
												<CCardBody>
													<CTable align='middle' hover responsive striped>
														<CTableHead>
															<CTableRow>
																<CTableHeaderCell>Name</CTableHeaderCell>
																<CTableHeaderCell>Date</CTableHeaderCell>
																<CTableHeaderCell>Available</CTableHeaderCell>
																<CTableHeaderCell>Actions</CTableHeaderCell>
															</CTableRow>
														</CTableHead>
														<CTableBody>
															{/* if empty say no data */}
															{
																Events.length === 0 ? (
																	<CTableRow>
																		<CTableDataCell colSpan='4'>
																			<div className='d-flex justify-content-center'>
																				No data for {formatDate(defaultDate)}
																			</div>
																		</CTableDataCell>
																	</CTableRow>
																) : (
																	Events.map((event, index) => (
																		<CTableRow key={event._id}>
																			<CTableDataCell>{event.name}</CTableDataCell>
																			<CTableDataCell>{formatDate(event.date)}</CTableDataCell>
																			<CTableDataCell>{event.isAvailable ? 'yes' : 'no'}</CTableDataCell>
																			<CTableDataCell>
																				<CButton color='info' className='me-2'>
																					Edit
																				</CButton>
																				<CButton color='danger'>
																					Delete
																				</CButton>
																			</CTableDataCell>
																		</CTableRow>
																	))
																)
															}
														</CTableBody>
													</CTable>
												</CCardBody>
											</CCard>
										</CCol>
									</CRow>
								</CContainer>
							</CTabPanel>
							<CTabPanel itemKey="form">
								<CForm onSubmit={handleSubmit(handleSubmitEvent)}>
									<CContainer>
										<CRow className='mb-3 mt-3'>
											<CCol>
												<CFormInput
													type='text'
													label='Event Name'
													placeholder='Event Name'
													{...register('name')}
													invalid={!!errors.name}
												/>
												{errors.name && (
													<div className="invalid-feedback">{errors.name.message}</div>
												)}
											</CCol>
										</CRow>
										<CRow className='mb-3'>
											<CCol>
												<CFormTextarea
													label='Description'
													placeholder='Description'
													{...register('description')}
													invalid={!!errors.description}
												/>
												{errors.description && (
													<div className="invalid-feedback">{errors.description.message}</div>
												)}
											</CCol>
										</CRow>
										<CRow className='mb-3'>
											<CCol>
												<CFormInput
													type='date'
													label='Date'
													placeholder='Date'
													defaultValue={(new Date()).toISOString().split('T')[0]}
													onChange={(e) => {
														setDefaultDate(e.target.value)
													}}
													{...register('date')}
													invalid={!!errors.date}
												/>
												{errors.date && (
													<div className="invalid-feedback">{errors.date.message}</div>
												)}
											</CCol>
										</CRow>
										<CRow className='mb-3'>
											{
												config.env === 'development' && (
													<CCol>
														<CButton color='info' onClick={handleFillMockData}>
															Fill Mock Data
														</CButton>
													</CCol>
												)
											}
											<CCol className='d-flex justify-content-end'>
												<CButton color='secondary' className='me-2' onClick={handleResetForm}>
													Reset
												</CButton>
												<CButton color='primary' type='submit'>
													Submit
												</CButton>
											</CCol>
										</CRow>
									</CContainer>
								</CForm>
								{
									isEdit && (<hr />)
								}
								{
									isEdit && (
										<CForm onSubmit={timeHandleSubmit(handleAddTimeslot)}>
											<CContainer>
												<CRow className='mb-3'>
													<CCol>
														<CCard>
															<CCardBody>
																<CTable align='middle' hover responsive striped>
																	<CTableHead>
																		<CTableRow>
																			<CTableHeaderCell>#</CTableHeaderCell>
																			<CTableHeaderCell>Start Time</CTableHeaderCell>
																			<CTableHeaderCell>End Time</CTableHeaderCell>
																			<CTableHeaderCell>Actions</CTableHeaderCell>
																		</CTableRow>
																	</CTableHead>
																	<CTableBody>
																		{
																			timeSlots.length === 0 ? (
																				<CTableRow>
																					<CTableDataCell colSpan='4'>
																						<div className='d-flex justify-content-center'>
																							No data
																						</div>
																					</CTableDataCell>
																				</CTableRow>
																			) : (
																				timeSlots.map((slot, index) => (
																					<CTableRow key={index}>
																						<CTableDataCell>
																							{/* if slot._id exits, active */}
																							{
																								slot._id ? (
																									<small>
																										{slot._id}
																									</small>
																								) : (
																									<span className='text-danger'>
																										Inactive
																									</span>
																								)
																							}
																						</CTableDataCell>
																						<CTableDataCell>{formatTime(slot.start)}</CTableDataCell>
																						<CTableDataCell>{formatTime(slot.end)}</CTableDataCell>
																						<CTableDataCell>
																							<CButton
																								color='danger'
																								onClick={() => handleRemoveTimeslot(index)}
																							>
																								Delete
																							</CButton>
																						</CTableDataCell>
																					</CTableRow>
																				))
																			)
																		}
																	</CTableBody>
																</CTable>
															</CCardBody>
														</CCard>
													</CCol>
												</CRow>
												<CRow className='mb-3'>
													<CCol>
														<CFormInput
															type='time'
															label='Start Time'
															{...timeFormRegister('start')}
															invalid={!!timeErrors.start}
														/>
														{timeErrors.start && (
															<div className="invalid-feedback">{timeErrors.start.message}</div>
														)}
													</CCol>
													<CCol>
														<CFormInput
															type='time'
															label='End Time'
															{...timeFormRegister('end')}
															invalid={!!timeErrors.end}
														/>
														{timeErrors.end && (
															<div className="invalid-feedback">{timeErrors.end.message}</div>
														)}
													</CCol>
												</CRow>
												<CRow className='mb-3'>
													<CCol className='d-flex justify-content-end'>
														<CButton type='submit' color='primary'>
															Add Timeslot
														</CButton>
													</CCol>
												</CRow>
											</CContainer>
										</CForm>
									)
								}
							</CTabPanel>
						</CTabContent>
					</CTabs>
				</CModalBody>
			</CModal >
		</>
	)
}


ManageFacilityForm.propTypes = {
	isVisible: propTypes.bool.isRequired,
	onClose: propTypes.func.isRequired,
	facilityData: propTypes.object,
}

export default ManageFacilityForm