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
import {
  faAt,
  faBriefcase,
  faCalendar,
  faCalendarPlus,
  faClockFour,
  faCode,
  faCog,
  faCogs,
  faDashboard,
  faFile,
  faFileAlt,
  faFileArchive,
  faFileCircleCheck,
  faFileCirclePlus,
  faFileCircleQuestion,
  faStar,
  faUserClock,
} from '@fortawesome/free-solid-svg-icons'
import { icon } from '@fortawesome/fontawesome-svg-core'

const _nav = [
  // {
  //   component: CNavItem,
  //   name: 'Overview',
  //   to: '/dashboard',
  //   icon: <FontAwesomeIcon icon={faDashboard} className="nav-icon" />,
  //   badge: {
  //     color: 'danger',
  //     text: 'unfinished',
  //   },
  // },
  {
    component: CNavItem,
    name: 'Overview',
    to: '/dashboard/overview',
    icon: <FontAwesomeIcon icon={faDashboard} className="nav-icon" />,
    badge: {
      color: 'danger',
      text: 'unfinished',
    },
  },
  {
    component: CNavTitle,
    name: 'Recruitment',
  },
  {
    component: CNavItem,
    name: 'Jobpostings',
    to: '/recruitment/jobposting',
    icon: <FontAwesomeIcon icon={faStar} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Schedules',
    to: '/recruitment/schedules',
    icon: <FontAwesomeIcon icon={faClockFour} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Postings',
    to: '/recruitment/jobposts',
    icon: <FontAwesomeIcon icon={faAt} className="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Applicants',
  },
  {
    component: CNavItem,
    name: 'Applications',
    to: '/applicant/create',
    icon: <FontAwesomeIcon icon={faFileCirclePlus} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Screening',
    to: '/applicant/screening',
    icon: <FontAwesomeIcon icon={faFileCircleQuestion} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Training',
    to: '/applicant/training',
    icon: <FontAwesomeIcon icon={faFileAlt} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Shortlisted',
    to: '/applicant/shortlisted',
    icon: <FontAwesomeIcon icon={faFileCircleCheck} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Rejected',
    to: '/applicant/rejected',
    icon: <FontAwesomeIcon icon={faFileArchive} className="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Calender',
  },
  {
    component: CNavItem,
    name: 'Schedules',
    to: '/interviews/schedules',
    icon: <FontAwesomeIcon icon={faCalendarPlus} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Applicants',
    to: '/interviews/applicants',
    icon: <FontAwesomeIcon icon={faUserClock} className="nav-icon" />,
  },
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
    name: 'API',
    to: '/developer/api',
    icon: <FontAwesomeIcon icon={faCode} size="lg" className="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Configuration',
    icon: <FontAwesomeIcon icon={faCogs} size="lg" className="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Test Page',
        to: '/settings/TestPage',
      },
    ],
  },
]

export default _nav
