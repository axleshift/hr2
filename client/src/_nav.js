import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilBriefcase,
  cilCalculator,
  cilCalendar,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBriefcase, faCog, faCogs, faFile, faStar } from '@fortawesome/free-solid-svg-icons'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Recruitment',
  },
  // {
  //   component: CNavItem,
  //   name: 'Application Tracking',
  //   to: '/recruitment/ats',
  //   icon: <FontAwesomeIcon icon={faStar} className='me-3' size='lg' />,
  // },
  {
    component: CNavGroup,
    name: 'Jobpostings',
    icon: <FontAwesomeIcon icon={faBriefcase} className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Create & Edit',
        to: '/recruitment/jobposting',
      },
      {
        component: CNavItem,
        name: 'Schedules',
        to: '/recruitment/schedules',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Applicants',
    icon: <FontAwesomeIcon icon={faFile} className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Resumes',
        to: '/applicant/create',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Interviews',
    icon: <FontAwesomeIcon icon={faBriefcase} className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Applicants',
        to: '/interviews/applicants',
      },
      {
        component: CNavItem,
        name: 'Schedules',
        to: '/interviews/schedules',
      },
    ],
  },
  // settings
  {
    component: CNavTitle,
    name: 'Settings',
  },
  {
    component: CNavItem,
    name: 'Tags & Categories',
    to: '/tags/tags',
    icon: <FontAwesomeIcon icon={faStar} size="lg" className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Configuration',
    to: '/settings/configuration',
    icon: <FontAwesomeIcon icon={faCogs} size="lg" className="nav-icon" />,
  },
]

export default _nav
