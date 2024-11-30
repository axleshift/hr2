import React from 'react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAt,
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
  faFileCirclePlus,
  faFileCircleQuestion,
  faInbox,
  faPaperPlane,
  faPlus,
  faStar,
  faUserClock,
} from '@fortawesome/free-solid-svg-icons'

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
    to: '/applicant/list',
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
    name: 'Calendar',
  },
  {
    component: CNavItem,
    name: 'Schedules',
    to: '/calendar/schedules',
    icon: <FontAwesomeIcon icon={faCalendarPlus} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Applicants',
    to: '/calendar/applicants',
    icon: <FontAwesomeIcon icon={faUserClock} className="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Mail ',
  },
  {
    component: CNavItem,
    name: 'Compose',
    to: '/mail/compose',
    icon: <FontAwesomeIcon icon={faPlus} className="nav-icon" />,
    name: 'Mail ',
  },
  {
    component: CNavItem,
    name: 'Compose',
    to: '/mail/compose',
    icon: <FontAwesomeIcon icon={faPlus} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Inbox',
    to: '/mail/inbox',
    icon: <FontAwesomeIcon icon={faInbox} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Sent',
    to: '/mail/sent',
    icon: <FontAwesomeIcon icon={faPaperPlane} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Draft',
    to: '/mail/drafts',
    icon: <FontAwesomeIcon icon={faDraftingCompass} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Template',
    to: '/mail/templates',
    icon: <FontAwesomeIcon icon={faClipboardList} className="nav-icon" />,
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
