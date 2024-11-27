import React, { useContext, useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { get } from '../../api/axios'

import AppPagination from '../../components/AppPagination'
import { AppContext } from '../../context/appContext'
import {
  CButton,
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CButtonGroup,
  CTooltip,
  CSpinner,
} from '@coreui/react'
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { formattedDate, formattedDateMMM } from '../../utils'
import { useNavigate } from 'react-router-dom'

const Schedule = () => {
  const { addToast } = useContext(AppContext)
  const [isSmall, setIsSmall] = useState(false)
  const [allData, setAllData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [params, setParams] = useState({
    start: new Date(),
    end: new Date(),
    // today: new Date(),
    // +10 Days
    today: new Date(new Date().setDate(new Date().getDate() - 1)),
    tomorrow: new Date(new Date().setDate(new Date().getDate() + 1)),
    nextWeek: new Date(new Date().setDate(new Date().getDate() + 7)),
  })
  const [filter, setFilter] = useState({
    active: false,
    inactive: false,
    all: true,
  })

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  // Legends
  const [legends, setLegends] = useState([
    {
      color: 'success',
      text: 'active',
      isChecked: filter.active,
    },
    {
      color: 'danger',
      text: 'inactive',
      isChecked: filter.inactive,
    },
    {
      color: 'warning',
      text: 'both',
      isChecked: filter.all,
    },
  ])

  const formSchema = z
    .object({
      jpfSchedStart: z.date().optional(),
      jpfSchedEnd: z.date().optional(),
    })
    .refine(
      (data) => {
        // console.log('Start Date:', data.jpfSchedStart, 'End Date:', data.jpfSchedEnd)
        return data.jpfSchedEnd > data.jpfSchedStart
      },
      {
        message: 'End Date must be after Start Date',
        path: ['jpfSchedEnd'],
      },
    )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  })

  const getAllScheduled = async (page, limit) => {
    try {
      setIsLoading(true)
      const filterer = Object.keys(filter).find((key) => filter[key] === true)
      const sort = 'desc'
      const res = await get(
        `/jobposting/scheduled?start=${params.today}&end=${params.nextWeek}&page=${page}&limit=${limit}&sort=${sort}&filter=${filterer}`,
      )

      setAllData(res.data.data)
      setCurrentPage(res.data.currentPage)
      setTotalPages(res.data.totalPages)
      setTotalItems(res.data.total)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  //
  const navigate = useNavigate()
  const handleReview = (id) => {
    navigate(`/recruitment/jobposter/${id}`)
    addToast('Review', 'Redirecting to Job Poster', 'info')
  }

  const handleLegendOnLick = (text) => {
    console.log('Legend: ', text)
    let newFilter = {
      active: false,
      inactive: false,
      all: false,
    }

    switch (text) {
      case 'active':
        newFilter = {
          active: true,
          inactive: false,
          all: false,
        }
        break

      case 'inactive':
        newFilter = {
          active: false,
          inactive: true,
          all: false,
        }
        break

      case 'both':
        newFilter = {
          active: false,
          inactive: false,
          all: true,
        }
        break

      default:
        console.warn('Unknown legend:', text)
    }

    setFilter(newFilter)
    setLegends((prevLegends) => {
      return prevLegends.map((legend) => {
        return {
          ...legend,
          isChecked: legend.text === text,
        }
      })
    })
  }

  useEffect(() => {
    getAllScheduled(currentPage, itemsPerPage)
  }, [params, currentPage, itemsPerPage, filter, legends])

  return (
    <>
      <CContainer>
        <CRow>
          <CContainer>
            <h1>Scheduled Job Postings</h1>

            <small className="text-muted">
              You can view all scheduled job postings here. The system will not post the job posting
              until its given approval. by Default, the system will display all scheduled job
              postings from today to next week.
            </small>
            {/* <p className='text-muted text-small'>
                  Displaying all scheduled job postings from today to next week as default
                </p> */}
            <CForm onSubmit={handleSubmit(getAllScheduled)}>
              <CRow className="d-flex gap-2 align-items-end">
                <CCol>
                  <CFormLabel htmlFor="jpfSchedStart">Start Date</CFormLabel>
                  <CFormInput
                    type="date"
                    id="jpfSchedStart"
                    name="jpfSchedStart"
                    value={formattedDate(params.today)}
                    onChange={(e) => setParams({ ...params, today: e.target.value })}
                  />
                </CCol>
                <CCol>
                  <CFormLabel htmlFor="jpfSchedEnd">End Date</CFormLabel>
                  <CFormInput
                    type="date"
                    id="jpfSchedEnd"
                    name="jpfSchedEnd"
                    value={formattedDate(params.nextWeek)}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        nextWeek: e.target.value,
                      })
                    }
                  />
                </CCol>
                {/* <CCol md={1}>
                      <CButton
                        color='primary'
                        onClick={getAllScheduled}

                      >
                        Search
                      </CButton>
                    </CCol> */}
              </CRow>
            </CForm>

            <div>
              {/* Legends */}
              <CButtonGroup className="d-flex flex-row gap-2 mt-3">
                {legends.map((legend, index) => (
                  <div key={index} className={`d-flex flex-row gap-2 d-flex align-items-center`}>
                    <CButton
                      onClick={() => handleLegendOnLick(legend.text)}
                      className={
                        legend.isChecked ? `btn btn-${legend.color}` : 'btn btn-outline-secondary'
                      }
                    />
                    <small className="text-capitalize text-muted">{legend.text}</small>
                  </div>
                ))}
              </CButtonGroup>
            </div>
            {isLoading ? (
              <div className="pt-3 text-center">
                <CSpinner color="primary" variant="grow" />
              </div>
            ) : (
              <div>
                {allData && allData.length > 0 ? (
                  <small className="text-capitalize text-muted mt-3">
                    Fetched total of {totalItems} job postings for
                    <span className="text-info mx-2">{formattedDateMMM(params.today)}</span>-
                    <span className="text-info mx-2">{formattedDateMMM(params.nextWeek)}</span>
                  </small>
                ) : (
                  <small className="text-capitalize text-muted mt-3">
                    No scheduled jobpostings found for
                    <span className="text-info mx-2">{formattedDateMMM(params.today)}</span>-
                    <span className="text-info mx-2">{formattedDateMMM(params.nextWeek)}</span>
                  </small>
                )}
                <ul className="list-group">
                  {/* {allData.length === 0 ? (
                    <small className="text-capitalize text-muted mt-3">
                      No scheduled jobpostings found for
                      <span className="text-info mx-2">{formattedDateMMM(params.today)}</span>-
                      <span className="text-info mx-2">{formattedDateMMM(params.nextWeek)}</span>
                    </small>
                  ) : (
                    allData.map((data, index) => (
                      <li
                        key={index}
                        className={`list-group-item d-flex flex-row gap-2 justify-content-between align-items-center `}
                      >
                        <div className="d-flex flex-row gap-2">
                          <div>
                            <strong>{data.title}</strong>
                            <div className="text-muted d-flex flex-row gap-2 align-items-center">
                              <div
                                style={{
                                  width: '15px',
                                  height: '15px',
                                }}
                                className={`rounded
                                                ${data.status === 'active' ? 'bg-success' : 'bg-danger'}`}
                              />
                              <div>
                                {formattedDateMMM(data.schedule_start)} -{' '}
                                {formattedDateMMM(data.schedule_end)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <CTooltip content="Review" placement="top">
                          <CButton
                            type="button"
                            onClick={() => handleReview(data._id)}
                            className="btn btn-primary d-flex flex-row gap-2 align-items-center"
                          >
                            <FontAwesomeIcon icon={faClipboardCheck} />
                          </CButton>
                        </CTooltip>
                      </li>
                    ))
                  )} */}
                  {allData.map((data, index) => (
                    <li
                      key={index}
                      className={`list-group-item d-flex flex-row gap-2 justify-content-between align-items-center `}
                    >
                      <div className="d-flex flex-row gap-2">
                        <div>
                          <strong>{data.title}</strong>
                          <div className="text-muted d-flex flex-row gap-2 align-items-center">
                            <div
                              style={{
                                width: '15px',
                                height: '15px',
                              }}
                              className={`rounded
                                                    ${data.status === 'active' ? 'bg-success' : 'bg-danger'}`}
                            />
                            <div>
                              {formattedDateMMM(data.schedule_start)} -{' '}
                              {formattedDateMMM(data.schedule_end)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <CTooltip content="Review" placement="top">
                        <CButton
                          type="button"
                          onClick={() => handleReview(data._id)}
                          className="btn btn-primary d-flex flex-row gap-2 align-items-center"
                        >
                          <FontAwesomeIcon icon={faClipboardCheck} />
                        </CButton>
                      </CTooltip>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CContainer>
        </CRow>
        <CRow>
          <div className="mt-3 d-flex flex-row gap-2 justify-content-center align-items-center">
            <AppPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </CRow>
      </CContainer>
    </>
  )
}

export default Schedule
