import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Overview'))

// Recruitment | HR2
const ApplicationTracking = React.lazy(() => import('./views/recruitment/ats'))
const Jobposting = React.lazy(() => import('./views/recruitment/Jobposting'))
const Jobposter = React.lazy(() => import('./views/recruitment/Jobposter'))
const Jobposts = React.lazy(() => import('./views/recruitment/Jobposts'))
const Schedules = React.lazy(() => import('./views/recruitment/Schedule'))
const JobpostingReq = React.lazy(() => import('./views/recruitment/JobpostingRequest'))

// Applicants

// Applicants
// const Applicant = React.lazy(() => import('./views/applicants/Applicant'))
const Screening = React.lazy(() => import('./views/applicants/Screening'))
const AppInterviews = React.lazy(() => import('./views/applicants/Interviews'))
const Shortlisted = React.lazy(() => import('./views/applicants/Shortlisted'))
const Training = React.lazy(() => import('./views/applicants/Training'))
const Rejected = React.lazy(() => import('./views/applicants/Rejected'))

// Facilities | HR2
const Facilities = React.lazy(() => import('./views/facility/Facilities'))

// Interviews | HR2
const CreateInterview = React.lazy(() => import('./views/calendar/Applicants'))
const Interviews = React.lazy(() => import('./views/calendar/Schedules'))

// Mail | HR2
const Compose = React.lazy(() => import('./views/mail/Compose'))
const Drafts = React.lazy(() => import('./views/mail/Drafts'))
const Inbox = React.lazy(() => import('./views/mail/Inbox'))
const Sent = React.lazy(() => import('./views/mail/Sent'))
const MailTemplates = React.lazy(() => import('./views/mail/Templates'))

// Accounts
const Users = React.lazy(() => import('./views/accounts/Users'))

// Configuration | HR2
const TestPage = React.lazy(() => import('./views/settings/TestPage'))
const Tags = React.lazy(() => import('./views/tags/Tags'))
const API = React.lazy(() => import('./views/developer/api'))

// Errors
const Page404 = React.lazy(() => import('./views/errors/Page404'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  {
    path: '/dashboard/overview',
    name: 'Dashboard',
    element: Dashboard,
    permissions: ['superadmin', 'admin', 'user'],
  },
  // Recruitment | HR2
  {
    path: '/recruitment/ats',
    name: 'Application Tracking',
    element: ApplicationTracking,
    permissions: ['superadmin', 'admin', 'user'],
  },
  {
    path: '/recruitment/jobposting',
    name: 'Jobposting',
    element: Jobposting,
    permissions: ['superadmin', 'admin', 'user'],
  },
  {
    path: '/recruitment/jobposter/:id',
    name: 'Jobposter',
    element: Jobposter,
    permissions: ['superadmin', 'admin', 'user'],
  },
  {
    path: '/recruitment/jobposts',
    name: 'Jobposts',
    element: Jobposts,
    permissions: ['superadmin', 'admin', 'user'],
  },
  {
    path: '/recruitment/schedules',
    name: 'Schedules',
    element: Schedules,
    permissions: ['superadmin', 'admin', 'user'],
  },
  {
    path: '/recruitment/jobposting/request',
    name: 'Jobposting Request',
    element: JobpostingReq,
    permissions: ['superadmin', 'admin', 'user'],
  },

  // Applicants
  // {
  //   path: '/applicant/list',
  //   name: 'Resume Create',
  //   element: Applicant,
  //   permissions: ['superadmin', 'admin', 'user'],
  // },
  {
    path: '/applicant/screening',
    name: 'Screening',
    element: Screening,
    permissions: ['superadmin', 'admin', 'user'],
  },
  {
    path: '/applicant/interviews',
    name: 'Interviews',
    element: AppInterviews,
    permissions: ['superadmin', 'admin', 'user'],
  },
  {
    path: '/applicant/training',
    name: 'Screening',
    element: Training,
    permissions: ['superadmin', 'admin', 'user'],
  },
  {
    path: '/applicant/shortlisted',
    name: 'Screening',
    element: Shortlisted,
    permissions: ['superadmin', 'admin', 'user'],
  },
  {
    path: '/applicant/rejected',
    name: 'Screening',
    element: Rejected,
    permissions: ['superadmin', 'admin', 'user'],
  },

  // Calendar | HR2
  {
    path: '/calendar/applicants',
    name: 'Create Interview',
    element: CreateInterview,
    permissions: ['superadmin', 'admin', 'user'],
  },
  {
    path: '/calendar/schedules',
    name: 'Interviews',
    element: Interviews,
    permissions: ['superadmin', 'admin', 'user'],
  },
  {
    path: '/calendar/facilities',
    name: 'Facilities',
    element: Facilities,
    permissions: ['superadmin', 'admin', 'user'],
  },

  // Mail | HR2
  {
    path: '/mail/compose',
    name: 'Compose',
    element: Compose,
    permissions: ['superadmin', 'admin', 'user'],
  },
  {
    path: '/mail/drafts',
    name: 'Drafts',
    element: Drafts,
    permissions: ['superadmin', 'admin', 'user'],
  },
  {
    path: '/mail/inbox',
    name: 'Inbox',
    element: Inbox,
    permissions: ['superadmin', 'admin', 'user'],
  },
  {
    path: '/mail/sent',
    name: 'Sent',
    element: Sent,
    permissions: ['superadmin', 'admin', 'user'],
  },
  {
    path: '/mail/templates',
    name: 'Mail Templates',
    element: MailTemplates,
    permissions: ['superadmin', 'admin', 'user'],
  },

  // Accounts
  {
    path: '/accounts/users',
    name: 'Users',
    element: Users,
    permissions: ['superadmin', 'admin'],
  },

  {
    path: '/widgets',
    name: 'Widgets',
    element: Widgets,
    permissions: ['superadmin', 'admin', 'user'],
  },

  // Configuration | HR2
  {
    path: '/settings/TestPage',
    name: 'Test Page',
    element: TestPage,
    permissions: ['admin'],
  },

  // Tags & Categories | HR2
  { path: '/tags/tags', name: 'Tags', element: Tags, permissions: ['superadmin', 'admin', 'user'] },

  // Developer
  {
    path: '/developer/api',
    name: 'API',
    element: API,
    permissions: ['superadmin', 'user'],
  },

  { path: '*', name: 'Page404', element: Page404, permissions: ['admin', 'user', 'guest'] },

  { path: '*', name: 'Page404', element: Page404, permissions: ['admin', 'user', 'guest'] },
]

export default routes
