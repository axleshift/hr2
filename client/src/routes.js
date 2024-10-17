import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Recruitment | HR2
const ApplicationTracking = React.lazy(() => import('./views/recruitment/ats'))
const Jobposting = React.lazy(() => import('./views/recruitment/Jobposting'))
const Jobposter = React.lazy(() => import('./views/recruitment/Jobposter'))
const Schedules = React.lazy(() => import('./views/recruitment/Schedule'))
const Applicant = React.lazy(() => import('./views/applicants/Applicant'))

// Tags & Categories | HR2
const Tags = React.lazy(() => import('./views/tags/Tags'))

// Interviews | HR2
const CreateInterview = React.lazy(() => import('./views/interviews/Applicants'))
const Interviews = React.lazy(() => import('./views/interviews/Schedules'))

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
  { path: '/recruitment/schedules', name: 'Schedules', element: Schedules },
  { path: '/applicant/create', name: 'Resume Create', element: Applicant },

  // Tags & Categories | HR2
  { path: '/tags/tags', name: 'Tags', element: Tags },

  // Errors | HR2
  { path: '*', name: 'Page404', element: Page404 },

  // Interviews | HR2
  { path: '/interviews/applicants', name: 'Create Interview', element: CreateInterview },
  { path: '/interviews/schedules', name: 'Interviews', element: Interviews },

  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
