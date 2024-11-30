import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Recruitment | HR2
const ApplicationTracking = React.lazy(() => import('./views/recruitment/ats'))
const Jobposting = React.lazy(() => import('./views/recruitment/Jobposting'))
const Jobposter = React.lazy(() => import('./views/recruitment/Jobposter'))
const Jobposts = React.lazy(() => import('./views/recruitment/Jobposts'))
const Schedules = React.lazy(() => import('./views/recruitment/Schedule'))

// Applicants
const Applicant = React.lazy(() => import('./views/applicants/Applicant'))
const Screening = React.lazy(() => import('./views/applicants/Screening'))
const Shortlisted = React.lazy(() => import('./views/applicants/Shortlisted'))
const Training = React.lazy(() => import('./views/applicants/Training'))
const Rejected = React.lazy(() => import('./views/applicants/Rejected'))

// Mail | HR2
const Compose = React.lazy(() => import('./views/mail/Compose'))
const Drafts = React.lazy(() => import('./views/mail/Drafts'))
const Inbox = React.lazy(() => import('./views/mail/Inbox'))
const Sent = React.lazy(() => import('./views/mail/Sent'))
const MailTemplates = React.lazy(() => import('./views/mail/Templates'))

// Tags & Categories | HR2
const Tags = React.lazy(() => import('./views/tags/Tags'))

// Interviews | HR2
const CreateInterview = React.lazy(() => import('./views/calendar/Applicants'))
const Interviews = React.lazy(() => import('./views/calendar/Schedules'))

// Configuration | HR2
const TestPage = React.lazy(() => import('./views/settings/TestPage'))

// Developer
const API = React.lazy(() => import('./views/developer/api'))

// Errors
const Page404 = React.lazy(() => import('./views/errors/Page404'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  // Recruitment | HR2
  { path: '/recruitment/ats', name: 'Application Tracking', element: ApplicationTracking },
  { path: '/recruitment/jobposting', name: 'Jobposting', element: Jobposting },
  { path: '/recruitment/jobposter/:id', name: 'Jobposter', element: Jobposter },
  { path: '/recruitment/jobposts', name: 'Jobposts', element: Jobposts },
  { path: '/recruitment/schedules', name: 'Schedules', element: Schedules },

  // Tags & Categories | HR2
  { path: '/tags/tags', name: 'Tags', element: Tags },

  // Applicants
  { path: '/applicant/list', name: 'Resume Create', element: Applicant },
  { path: '/applicant/screening', name: 'Screening', element: Screening },
  { path: '/applicant/training', name: 'Screening', element: Training },
  { path: '/applicant/shortlisted', name: 'Screening', element: Shortlisted },
  { path: '/applicant/rejected', name: 'Screening', element: Rejected },

  // Calendar | HR2
  { path: '/calendar/applicants', name: 'Create Interview', element: CreateInterview },
  { path: '/calendar/schedules', name: 'Interviews', element: Interviews },

  // Mail | HR2
  { path: '/mail/compose', name: 'Compose', element: Compose },
  { path: '/mail/drafts', name: 'Drafts', element: Drafts },
  { path: '/mail/inbox', name: 'Inbox', element: Inbox },
  { path: '/mail/sent', name: 'Sent', element: Sent },
  { path: '/mail/templates', name: 'Mail Templates', element: MailTemplates },

  { path: '/widgets', name: 'Widgets', element: Widgets },

  // Configuration | HR2
  { path: '/settings/TestPage', name: 'Test Page', element: TestPage },

  // Developer
  { path: '/developer/api', name: 'API', element: API },

  { path: '*', name: 'Page404', element: Page404 },
]

export default routes
