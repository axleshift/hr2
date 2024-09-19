import React, { act, useEffect, useState } from 'react'
import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { get } from '../../api/axios'
import dayjs from 'dayjs'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormCheck,
  CFormFeedback,
  CCollapse,
  CButtonGroup,
  CTooltip,
} from '@coreui/react'
import { faChevronDown, faChevronUp, faChevronLeft, faCircleChevronLeft, faChevronRight, faCircleChevronRight, faLocationPin, faMoneyBill, faRefresh, faTrash, faPencil, faCalendar, faClipboard, faClipboardCheck } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { formattedDate, formattedDateMMM } from '../../utils'
import { useNavigate } from 'react-router-dom';

const Schedule = () => {
  const [isSmall, setIsSmall] = useState(false);
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [params, setParams] = useState({
    start: new Date(),
    end: new Date(),
    // today: new Date(),
    // +10 Days
    today: new Date(new Date().setDate(new Date().getDate() - 1)),
    tomorrow: new Date(new Date().setDate(new Date().getDate() + 1)),
    nextWeek: new Date(new Date().setDate(new Date().getDate() + 7)),
  });
  const [filter, setFilter] = useState({
    active: false,
    inactive: false,
    all: true,
  });

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
      onClick: () => setFilter({ active: true, inactive: false, all: false }),
    },
    {
      color: 'danger',
      text: 'inactive',
      isChecked: filter.inactive,
      onClick: () => setFilter({ active: false, inactive: true, all: false }),
    }, {
      color: 'warning',
      text: 'both',
      isChecked: filter.all,
      onClick: () => setFilter({ active: false, inactive: false, all: true }),
    }
  ]);

  const formSchema = z.object({
    sdStartDate: z.date().optional(),
    sdEndDate: z.date().optional(),
  })
    .refine((data) => {
      console.log("Start Date:", data.jpfSchedStart, "End Date:", data.jpfSchedEnd);
      return data.jpfSchedEnd > data.jpfSchedStart;
    }, {
      message: 'End Date must be after Start Date',
      path: ['jpfSchedEnd'],
    })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });


  const getAllScheduled = async (page, limit) => {
    try {
      setIsLoading(true);
      console.log("Params: ", params);
      const filterer = Object.keys(filter).find((key) => filter[key] === true);
      console.log("Filter: ", filterer);
      const sort = 'desc';
      const res = await get(`/jobposting/scheduled?start=${params.today}&end=${params.nextWeek}&page=${page}&limit=${limit}&sort=${sort}&filter=${filterer}`);
      console.log("Response: ", res);
      // if (filter.activeOnly) {
      //   setAllData(res.data.filter((data) => data.status === 'active'));
      // }
      // else if (filter.inactiveOnly) {
      //   setAllData(res.data.filter((data) => data.status === 'inactive'));
      // }
      // else {
      //   setAllData(res.data);
      // }
      setAllData(res.data);
      setCurrentPage(res.currentPage);
      setTotalPages(res.totalPages);
      setTotalItems(res.total);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  //
  const navigate = useNavigate();
  const handleReview = (id) => {
    navigate(`/recruitment/jobposter/${id}`);
    console.log("Reviewing: ", id);
  }

  useEffect(() => {
    getAllScheduled(currentPage, itemsPerPage);
    // console.log("Params: ", params);
    // console.log("Filter: ", filter);
    console.log("Legends: ", legends);

  }, [params, currentPage, itemsPerPage, filter, legends]);

  // Pagination handler
  const handlePageChange = (action) => {
    console.log("Action: ", action);

    switch (action) {
      case 'firstPage':
        setCurrentPage(1);
        break;

      case 'prevPage':
        setCurrentPage((prevPage) => prevPage - 1);
        break;

      case 'nextPage':
        setCurrentPage((prevPage) => prevPage + 1)
        break;

      case 'lastPage':
        setCurrentPage(totalPages)
        break;

      default:
        console.warn('Unknown action:', action);
    }
  };

  return (
    <>
      <CContainer>
        <CRow>
          <CContainer>
            <CCard>
              <CCardHeader>
                <div className='d-flex justify-content-between align-items-center'>
                  <strong>
                    Scheduled Job Postings
                  </strong>
                </div>
              </CCardHeader>
              <CCardBody>
                <p className='text-muted'>
                  You can view all scheduled job postings here.
                  The system will not post the job posting until its given approval.
                  by Default, the system will display all scheduled job postings from today to next week.
                </p>
                {/* <p className='text-muted text-small'>
                  Displaying all scheduled job postings from today to next week as default
                </p> */}
                <CForm onSubmit={handleSubmit(getAllScheduled)}>
                  <CRow className='d-flex gap-2 align-items-end'>
                    <CCol>
                      <CFormLabel htmlFor='jpfSchedStart'>Start Date</CFormLabel>
                      <CFormInput
                        type='date'
                        id='jpfSchedStart'
                        name='jpfSchedStart'
                        value={formattedDate(params.today)}
                        onChange={(e) => setParams({ ...params, today: e.target.value })}
                      />
                    </CCol>
                    <CCol>
                      <CFormLabel htmlFor='jpfSchedEnd'>End Date</CFormLabel>
                      <CFormInput
                        type='date'
                        id='jpfSchedEnd'
                        name='jpfSchedEnd'
                        value={formattedDate(params.nextWeek)}
                        onChange={(e) => setParams({ ...params, nextWeek: e.target.value })}
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
                  <CButtonGroup className='d-flex flex-row gap-2 mt-3'>
                    {
                      legends.map((legend, index) => (
                        <div key={index} className={`d-flex flex-row gap-2 d-flex align-items-center`}>
                          <CButton
                            type='button'
                            color={legend.color}
                            variant='outline'
                            onClick={legend.onClick}
                          />
                          <div className='text-lowercase text-muted text-small'>
                            {legend.text}
                          </div>
                        </div>
                      ))
                    }
                  </CButtonGroup>
                </div>

                {isLoading ? (
                  <p>Loading...</p>
                ) : (
                  <div>
                    <hr />
                    {
                      allData && allData.length > 0 && (
                        <div className='mb-3 text-uppercase d-flex flex-row gap-2'>
                          <div>
                            Fetched total of {totalItems} job postings for
                          </div>
                          <span className='text-info mx-2'>
                            {formattedDateMMM(params.today)}
                          </span>
                          -
                          <span className='text-info mx-2'>
                            {formattedDateMMM(params.nextWeek)}
                          </span>
                        </div>
                      )
                    }
                    <ul className='list-group'>
                      {allData.length === 0 ? (
                        <p className='text-uppercase'>No scheduled jobpostings found for
                          <span className='text-info mx-2'>
                            {formattedDateMMM(params.today)}
                          </span>
                          -
                          <span className='text-info mx-2'>
                            {formattedDateMMM(params.nextWeek)}
                          </span>
                        </p>
                      ) : (
                        allData.map((data, index) => (
                          <li key={index}
                            className={`list-group-item d-flex flex-row gap-2 justify-content-between align-items-center `}>
                            <div className='d-flex flex-row gap-2'>
                              <div>
                                <strong>
                                  {data.title}
                                </strong>
                                <div className='text-muted d-flex flex-row gap-2 align-items-center'>
                                  <div
                                    style={{ width: '15px', height: '15px' }}
                                    className={`rounded
                                                ${data.status === 'active' ? 'bg-success' : 'bg-danger'}`}
                                  />
                                  <div>
                                    {formattedDateMMM(data.schedule_start)} - {formattedDateMMM(data.schedule_end)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <CTooltip
                              content='Review'
                              placement='top'
                            >
                              <CButton type='button' onClick={() => handleReview(data._id)} className='btn btn-primary d-flex flex-row gap-2 align-items-center'>
                                <FontAwesomeIcon icon={faClipboardCheck} />
                              </CButton>
                            </CTooltip>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )}
              </CCardBody>
              <CCardFooter className='d-flex flex-row gap-2 justify-content-center align-items-center'>
                <CButton onClick={() => handlePageChange('firstPage')} disabled={currentPage === 1 && true} className='btn btn-outline-primary'>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </CButton>

                <CButton onClick={() => handlePageChange('prevPage')} disabled={currentPage === 1 && true} className='btn btn-outline-primary'>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </CButton>
                <p>
                  Page {currentPage} of {totalPages}
                </p>

                <CButton onClick={() => handlePageChange('nextPage')} disabled={currentPage === totalPages && true} className='btn btn-outline-primary'>
                  <FontAwesomeIcon icon={faChevronRight} />
                </CButton>
                <CButton onClick={() => handlePageChange('lastPage')} disabled={currentPage === totalPages && true} className='btn btn-outline-primary'>
                  <FontAwesomeIcon icon={faChevronRight} />
                </CButton>
              </CCardFooter>
            </CCard>
          </CContainer>
        </CRow >
      </CContainer >
    </>
  );
};

export default Schedule;
