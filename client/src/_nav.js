import React from 'react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faAt,
  faBriefcase,
  faBuilding,
  faCalendarPlus,
  faClipboardList,
  faClockFour,
  faCode,
  faCogs,
  faDashboard,
  faDraftingCompass,
  faFileAlt,
  faFileArchive,
  faFileCircleCheck,
  faFileCircleExclamation,
  faFileCirclePlus,
  faFileCircleQuestion,
  faInbox,
  faPaperPlane,
  faPlus,
  faStar,
  faUserClock,
  faUsersViewfinder,
} from '@fortawesome/free-solid-svg-icons'

const _nav = [
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
    component: CNavItem,
    name: 'Request',
    to: '/recruitment/jobposting/request',
    icon: <FontAwesomeIcon icon={faFileAlt} className="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Application Tracking',
  },
  {
    component: CNavItem,
    name: 'Screening',
    to: '/applicant/screening',
    icon: <FontAwesomeIcon icon={faFileCircleQuestion} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Shortlisted',
    to: '/applicant/shortlisted',
    icon: <FontAwesomeIcon icon={faFileCircleCheck} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Interviews',
    to: '/applicant/interviews',
    icon: <FontAwesomeIcon icon={faFileCirclePlus} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Rejected',
    to: '/applicant/rejected',
    icon: <FontAwesomeIcon icon={faFileArchive} className="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Event Management',
  },
  {
    component: CNavItem,
    name: 'Facilities',
    to: '/calendar/facilities',
    icon: <FontAwesomeIcon icon={faBuilding} className="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Job Management',
  },
  {
    component: CNavItem,
    name: 'Jobs',
    to: '/jobs',
    icon: <FontAwesomeIcon icon={faBriefcase} className="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Accounts',
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/accounts/users',
    icon: <FontAwesomeIcon icon={faUsersViewfinder} className="nav-icon" />,
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
    permissions: ['superadmin', 'admin'],
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
