import React, { useState, useEffect } from 'react'
import classNames from 'classnames'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilPeople } from '@coreui/icons'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import { get } from '../../api/axios'
import { formatCurrency, formatDate } from '../../utils'
import { useNavigate } from 'react-router-dom'

const Overview = () => {
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  const now = new Date();
  const lastWeek = new Date(now);
  lastWeek.setDate(now.getDate() - 7);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const APP_STATUS = {
    journey: [
      { key: 'isShortlisted', label: 'Shortlisted', color: 'success' },
      { key: 'isInitialInterview', label: 'Initial Interview', color: 'warning' },
      { key: 'isTechnicalInterview', label: 'Technical Interview', color: 'primary' },
      { key: 'isPanelInterview', label: 'Panel Interview', color: 'danger' },
      { key: 'isBehavioralInterview', label: 'Behavior Interview', color: 'info' },
      { key: 'isFinalInterview', label: 'Final Interview', color: 'warning' },
      { key: 'isJobOffer', label: 'Job Offer', color: 'primary' },
      { key: 'isHired', label: 'Hired / Deployment', color: 'success' },
    ],
  }

  const getStageColor = (stageName) => {
    switch (stageName) {
      case 'Applied':
        return 'primary'; // Apply blue color for "Applied"
      case 'Shortlisted':
        return 'success'; // Green color for "Shortlisted"
      case 'Initial Interview':
        return 'warning'; // Yellow color for "Initial Interview"
      case 'Technical Interview':
        return 'info'; // Light blue color for "Technical Interview"
      case 'Panel Interview':
        return 'danger'; // Red color for "Panel Interview"
      case 'Behavioral Interview':
        return 'dark'; // Dark color for "Behavioral Interview"
      case 'Final Interview':
        return 'secondary'; // Light grey color for "Final Interview"
      case 'Job Offer':
        return 'primary'; // Blue color for "Job Offer"
      case 'Hired / Deployment':
        return 'success'; // Green color for "Hired"
      default:
        return 'light'; // Default color if unknown
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await get(`/stats`)
        setData(res.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, []) // Empty dependency array ensures it runs once after the component mounts

  if (!data) {
    return <div>Loading...</div> // Optionally show a loading state while data is being fetched
  }

  const gotoApplicant = (applicant) => {
    try {
      const applicantId = applicant._id
      navigate(`/applicant/profile/${applicantId}`)
      // window.open(`/applicant/profile/${applicantId}`)
    } catch (error) {
      console.error(error)
    }
  }

  const prepareChartData = (applicantsPerDay) => {
    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

    const dayMap = {}
    applicantsPerDay.forEach(entry => {
      const date = new Date(entry._id)
      const day = date.getDate()
      dayMap[day] = entry.count
    })

    const labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`)
    const data = labels.map(day => dayMap[parseInt(day)] || 0)

    return {
      labels,
      datasets: [
        {
          label: 'Applicants per Day',
          backgroundColor: `rgba(0, 123, 255, 0.1)`,
          borderColor: '#007bff',
          pointHoverBackgroundColor: '#007bff',
          borderWidth: 2,
          data,
          fill: true,
        },
      ],
    }
  }

  const prepareJourneyData = (journeyProgression) => {
    const labels = journeyProgression.map(item => item._id);

    const datasets = APP_STATUS.journey.map((stage) => {
      return {
        label: stage.label,
        data: journeyProgression.map(item => item[stage.key]),
        borderColor: stage.color,
        fill: false,
        tension: 0.1, // Optional: for smooth curves
      };
    });

    return { labels, datasets };
  };

  // Extract actual data
  const {
    applicants: {
      totalApplicants,
      recentApplicants,
      applicantsPerDay,
      applicantsThisMonth,
      journeyProgression,
      currentStages
    },
    jobpostings: {
      totalJobPostings,
      recentJobs,
      activeJobPostings,
      expiredJobPostings,
      jobTypes,
    },
    histograms
  } = data


  // Prepare progress data based on actual data
  const progress = [
    { title: 'Total Applicants', value: `${totalApplicants} Applicants`, percent: (totalApplicants / 1000) * 100, color: 'success' }, // assuming 1000 is your goal
    { title: 'Recent Applicants', value: `${recentApplicants.length} Applicants`, percent: (recentApplicants.length / totalApplicants) * 100, color: 'success' },
    { title: 'Applicants This Month', value: `${applicantsThisMonth} Applicants`, percent: (applicantsThisMonth / totalApplicants) * 100, color: 'info' },
  ];

  // Extract user data dynamically from recentApplicants
  const table = recentApplicants.map((applicant, index) => ({
    user: {
      _id: applicant._id,
      name: `${applicant.firstname} ${applicant.lastname}`, // Full name
      qualification: applicant.highestQualification,
      experience: applicant.yearsOfExperience, // Experience in years
    },
    jobAppliedFor: applicant.jobAppliedFor, // Job applied for
    activity: `Last updated: ${new Date(applicant.createdAt).toLocaleString()}`, // Last updated timestamp
  })) || []

  return (
    <>
      {/* <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardBody>
              <CRow>
                <CCol sm={5}>
                  <h4 id="journey" className="card-title mb-0">
                    Journey Stages Over Time
                  </h4>
                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                  <CButton color="primary" className="float-end">
                    <CIcon icon={cilCloudDownload} />
                  </CButton>
                </CCol>
              </CRow>
              {journeyProgression && (
                <MainChart {...prepareJourneyData(journeyProgression)} />
              )}
            </CCardBody>
            <CCardFooter>
              <CRow
                xs={{ cols: 1, gutter: 4 }}
                sm={{ cols: 2 }}
                lg={{ cols: 4 }}
                xl={{ cols: 5 }}
                className="mb-2 text-center d-flex justify-content-center"
              >
                {currentStages.map((item, i) => (
                  <CCol
                    className={classNames({
                      'd-none d-xl-block': i + 1 === currentStages.length,
                    })}
                    key={i}
                  >
                    <CCard
                      className="text-center border-0 shadow-sm"
                      color={getStageColor(item._id)}
                      style={{ maxWidth: '180px', margin: '0 auto' }}
                    >
                      <CCardBody>
                        <div className="fs-5 fw-bold">{item.count}</div>
                        <div className="text-muted small">{item._id}</div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))}
              </CRow>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow> */}
      {/* <WidgetsDropdown className="mb-4" /> */}
      <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardBody>
              <CRow>
                <CCol sm={5}>
                  <h4 id="traffic" className="card-title mb-0">
                    Applicant Overview
                  </h4>
                  <div className="small text-body-secondary">
                    {`${startOfMonth.toLocaleString('default', { month: 'long' })} ${startOfMonth.getFullYear()}`}
                  </div>

                </CCol>
                <CCol sm={7} className="d-none d-md-block">
                  <CButton color="primary" className="float-end">
                    <CIcon icon={cilCloudDownload} />
                  </CButton>
                </CCol>
              </CRow>
              <MainChart {...prepareChartData(applicantsPerDay)} />
            </CCardBody>
            <CCardFooter>
              <CRow
                xs={{ cols: 1, gutter: 4 }}
                sm={{ cols: 2 }}
                lg={{ cols: 4 }}
                xl={{ cols: 5 }}
                className="mb-2 text-center d-flex justify-content-center"
              >
                {progress.map((item, index, items) => (
                  <CCol
                    className={classNames({
                      'd-none d-xl-block': index + 1 === items.length,
                    })}
                    key={index}
                  >
                    <div className="text-body-secondary">{item.title}</div>
                    <div className="fw-semibold text-truncate">
                      {item.value} ({item.percent.toFixed(0)}%)
                    </div>
                    <CProgress thin className="mt-2" color={item.color} value={item.percent} />
                  </CCol>
                ))}
              </CRow>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
      {/* <WidgetsBrand className="mb-4" withCharts /> */}
      <CRow
        xs={{ cols: 1, gutter: 4 }}
        sm={{ cols: 2 }}
        lg={{ cols: 4 }}
        xl={{ cols: 5 }}
        className="mb-3 text-center d-flex justify-content-center"
      >
        {currentStages.map((item, i) => (
          <CCol
            className={classNames({
              'd-none d-xl-block': i + 1 === currentStages.length,
            })}
            key={i}
          >
            <CCard
              className="text-center border-0 shadow-sm"
              color={getStageColor(item._id)}
              style={{ maxWidth: '180px', margin: '0 auto' }}
            >
              <CCardBody>
                <div className="fs-5 fw-bold">{item.count}</div>
                <div className="text-muted small">{item._id}</div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
      <CRow>
        <CCol>
          <h6>Recent Applicants</h6>
        </CCol>
      </CRow>
      <CRow>
        <CTable align="middle" className="mb-0 border rounded" hover responsive>
          <CTableHead className="text-nowrap">
            <CTableRow>
              <CTableHeaderCell className="bg-body-tertiary text-center">
                <CIcon icon={cilPeople} />
              </CTableHeaderCell>
              {/* <CTableHeaderCell className="bg-body-tertiary">ID</CTableHeaderCell> */}
              <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">Qualification</CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">Experience</CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">Job Applied For</CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">Activity</CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {recentApplicants.map((applicant, index) => (
              <CTableRow key={index}>
                <CTableDataCell className="text-center">
                  {/* <CAvatar size="md" status="success" /> */}
                  {
                    applicant.avatar ? (
                      <CAvatar size="md" status="success" />
                    ) : (
                      <CAvatar size="md" status="warning" />
                    )
                  }
                </CTableDataCell>
                {/* <CTableDataCell>{applicant._id}</CTableDataCell> */}
                <CTableDataCell>{`${applicant.firstname} ${applicant.lastname}`}</CTableDataCell>
                <CTableDataCell>{applicant.highestQualification}</CTableDataCell>
                <CTableDataCell>{applicant.yearsOfExperience} years</CTableDataCell>
                <CTableDataCell>{applicant.jobAppliedFor}</CTableDataCell>
                <CTableDataCell>
                  Last updated: {formatDate(applicant.createdAt)}
                </CTableDataCell>
                <CTableDataCell>
                  <CButton size='sm' color='info' onClick={() => gotoApplicant(applicant)}>
                    Manage
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CRow>
      <CRow className="mt-4">
        <CCol md={6} xl={3}>
          <CCard className="mb-4">
            <CCardHeader>Top Jobs Applied For</CCardHeader>
            <CCardBody>
              <div className="d-flex justify-content-between border-bottom py-1 fw-semibold text-muted">
                <span>Job Title</span>
                <span>Applicants</span>
              </div>
              {data.applicants?.histograms.jobAppliedFor.map((item, index) => (
                <div key={index} className="d-flex justify-content-between border-bottom py-1">
                  <span>{item._id || 'Unknown'}</span>
                  <span className="fw-semibold">{item.count}</span>
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6} xl={3}>
          <CCard className="mb-4">
            <CCardHeader>Top Qualifications</CCardHeader>
            <CCardBody>
              <div className="d-flex justify-content-between border-bottom py-1 fw-semibold text-muted">
                <span>Qualification</span>
                <span>Applicants</span>
              </div>
              {data.applicants?.histograms.qualifications.map((item, index) => (
                <div key={index} className="d-flex justify-content-between border-bottom py-1">
                  <span>{item._id || 'Unknown'}</span>
                  <span className="fw-semibold">{item.count}</span>
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6} xl={3}>
          <CCard className="mb-4">
            <CCardHeader>Graduation Year Distribution</CCardHeader>
            <CCardBody>
              <div className="d-flex justify-content-between border-bottom py-1 fw-semibold text-muted">
                <span>Year</span>
                <span>Applicants</span>
              </div>
              {data.applicants?.histograms.graduationYear.map((item, index) => (
                <div key={index} className="d-flex justify-content-between border-bottom py-1">
                  <span>{item._id}</span>
                  <span className="fw-semibold">{item.count}</span>
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6} xl={3}>
          <CCard className="mb-4">
            <CCardHeader>Experience Breakdown</CCardHeader>
            <CCardBody>
              <div className="d-flex justify-content-between border-bottom py-1 fw-semibold text-muted">
                <span>Years</span>
                <span>Applicants</span>
              </div>
              {data.applicants?.histograms.yearsOfExperience.map((item, index) => (
                <div key={index} className="d-flex justify-content-between border-bottom py-1">
                  <span>{item._id}</span>
                  <span className="fw-semibold">{item.count}</span>
                </div>
              ))}
            </CCardBody>
          </CCard>

        </CCol>
      </CRow>
      <CRow className="mt-4">
        <CCol>
          <h4>Jobpostings Overview</h4>
        </CCol>
      </CRow>
      <CRow>
        <CCol md={6} xl={4}>
          <CCard className="mb-4">
            <CCardHeader>Total Job Postings</CCardHeader>
            <CCardBody>
              <div className="fs-4 fw-bold text-center">{totalJobPostings}</div>
              <div className="text-body-secondary text-center">All job postings created</div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6} xl={4}>
          <CCard className="mb-4">
            <CCardHeader>Active Job Postings</CCardHeader>
            <CCardBody>
              <div className="fs-4 fw-bold text-center">{activeJobPostings}</div>
              <div className="text-body-secondary text-center">Currently published and accepting applicants</div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6} xl={4}>
          <CCard className="mb-4">
            <CCardHeader>Expired Job Postings</CCardHeader>
            <CCardBody>
              <div className="fs-4 fw-bold text-center">{expiredJobPostings}</div>
              <div className="text-body-secondary text-center">No longer active</div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol>
          <h6>Recent Job Postings</h6>
        </CCol>
      </CRow>
      <CRow className="mb-3">
        <CTable align="middle" className="mb-0 border rounded" hover responsive>
          <CTableHead className="text-nowrap">
            <CTableRow>
              <CTableHeaderCell className="bg-body-tertiary">Title</CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">Type</CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">Location</CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">Salary Range</CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">Status</CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">Created At</CTableHeaderCell>
              <CTableHeaderCell className="bg-body-tertiary">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {recentJobs.map((job, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{job.title}</CTableDataCell>
                <CTableDataCell>{job.type}</CTableDataCell>
                <CTableDataCell>{job.location}</CTableDataCell>
                <CTableDataCell>{formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)}</CTableDataCell>
                <CTableDataCell>{job.status || '—'}</CTableDataCell>
                <CTableDataCell>{formatDate(job.createdAt)}</CTableDataCell>
                <CTableDataCell>
                  <CButton size="sm" color="info">
                    Manage
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CRow>
    </>
  )
}

export default Overview
