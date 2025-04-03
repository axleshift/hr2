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
const ApplicantProfile = React.lazy(() => import('./views/applicants/ApplicantProfile'))

// Interviews | HR2
const CreateInterview = React.lazy(() => import('./views/calendar/Applicants'))
const Interviews = React.lazy(() => import('./views/calendar/Schedules'))

// Mail | HR2
const Compose = React.lazy(() => import('./views/mail/Compose'))
const Drafts = React.lazy(() => import('./views/mail/Drafts'))
const Inbox = React.lazy(() => import('./views/mail/Inbox'))
const Sent = React.lazy(() => import('./views/mail/Sent'))
const MailTemplates = React.lazy(() => import('./views/mail/Templates'))

// Facilities | HR2
const Facilities = React.lazy(() => import('./views/facility/Facilities'))

// Job Management
const Jobs = React.lazy(() => import('./views/job/Jobs'))

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
    permissions: ['admin', 'manager'],
  },
  // Recruitment | HR2
  {
    path: '/recruitment/ats',
    name: 'Application Tracking',
    element: ApplicationTracking,
    permissions: ['admin', 'manager'],
  },
  {
    path: '/recruitment/jobposting',
    name: 'Jobposting',
    element: Jobposting,
    permissions: ['admin', 'manager'],
  },
  {
    path: '/recruitment/jobposter/:id',
    name: 'Jobposter',
    element: Jobposter,
    permissions: ['admin', 'manager'],
  },
  {
    path: '/recruitment/jobposts',
    name: 'Jobposts',
    element: Jobposts,
    permissions: ['admin', 'manager'],
  },
  {
    path: '/recruitment/schedules',
    name: 'Schedules',
    element: Schedules,
    permissions: ['admin', 'manager'],
  },
  {
    path: '/recruitment/jobposting/request',
    name: 'Jobposting Request',
    element: JobpostingReq,
    permissions: ['admin', 'manager'],
  },
  {
    path: '/applicant/screening',
    name: 'Screening',
    element: Screening,
    permissions: ['admin', 'manager'],
  },
  {
    path: '/applicant/interviews',
    name: 'Interviews',
    element: AppInterviews,
    permissions: ['admin', 'manager'],
  },
  {
    path: '/applicant/training',
    name: 'Tranings',
    element: Training,
    permissions: ['admin', 'manager'],
  },
  {
    path: '/applicant/shortlisted',
    name: 'Shortlisted',
    element: Shortlisted,
    permissions: ['admin', 'manager'],
  },
  {
    path: '/applicant/rejected',
    name: 'Rejected',
    element: Rejected,
    permissions: ['admin', 'manager'],
  },
  {
    path: '/applicant/profile/:applicantId',
    name: 'Applicant Profile',
    element: ApplicantProfile,
    permissions: ['admin', 'manager'],
  },

  // Calendar | HR2
  {
    path: '/calendar/applicants',
    name: 'Create Interview',
    element: CreateInterview,
    permissions: ['admin', 'manager'],
  },
  {
    path: '/calendar/schedules',
    name: 'Interviews',
    element: Interviews,
    permissions: ['admin', 'manager'],
  },
  {
    path: '/calendar/facilities',
    name: 'Facilities',
    element: Facilities,
    permissions: ['admin', 'manager'],
  },

  // Jobs
  {
    path: '/jobs',
    name: 'Jobs',
    element: Jobs,
    permissions: ['admin', 'manager'],
  },

  // Mail | HR2
  {
    path: '/mail/compose',
    name: 'Compose',
    element: Compose,
    permissions: ['admin', 'manager'],
  },
  {
    path: '/mail/drafts',
    name: 'Drafts',
    element: Drafts,
    permissions: ['admin', 'manager'],
  },
  {
    path: '/mail/inbox',
    name: 'Inbox',
    element: Inbox,
    permissions: ['admin', 'manager'],
  },
  {
    path: '/mail/sent',
    name: 'Sent',
    element: Sent,
    permissions: ['admin', 'manager'],
  },
  {
    path: '/mail/templates',
    name: 'Mail Templates',
    element: MailTemplates,
    permissions: ['admin', 'manager'],
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
    permissions: ['admin', 'manager'],
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
