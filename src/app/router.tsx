import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/app/layouts/AppShell'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { GuestRoute } from '@/app/routes/GuestRoute'
import { ProtectedRoute } from '@/app/routes/ProtectedRoute'
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage'
import { LoginPage } from '@/features/auth/LoginPage'
import { MfaPage } from '@/features/auth/MfaPage'
import { ResetPasswordPage } from '@/features/auth/ResetPasswordPage'
import { ContactDetailPage } from '@/features/customers/ContactDetailPage'
import { ContactsPage } from '@/features/customers/ContactsPage'
import { LeadsPage } from '@/features/customers/LeadsPage'
import { PipelinePage } from '@/features/customers/PipelinePage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { AttendancePage } from '@/features/people/AttendancePage'
import { EmployeeDetailPage } from '@/features/people/EmployeeDetailPage'
import { EmployeeListPage } from '@/features/people/EmployeeListPage'
import { LeaveRequestsPage } from '@/features/people/LeaveRequestsPage'
import { PlaceholderPage } from '@/features/placeholders/PlaceholderPage'
import { BrandingPage } from '@/features/settings/BrandingPage'
import { DepartmentsPage } from '@/features/settings/DepartmentsPage'
import { OrganizationPage } from '@/features/settings/OrganizationPage'
import { SettingsLayout } from '@/features/settings/SettingsLayout'
import { UsersRolesPage } from '@/features/settings/UsersRolesPage'

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/forgot-password', element: <ForgotPasswordPage /> },
          { path: '/reset-password', element: <ResetPasswordPage /> },
          { path: '/mfa', element: <MfaPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/people/employees', element: <EmployeeListPage /> },
          { path: '/people/employees/:id', element: <EmployeeDetailPage /> },
          { path: '/people/leave', element: <LeaveRequestsPage /> },
          { path: '/people/attendance', element: <AttendancePage /> },
          { path: '/customers/leads', element: <LeadsPage /> },
          { path: '/customers/contacts', element: <ContactsPage /> },
          { path: '/customers/contacts/:id', element: <ContactDetailPage /> },
          { path: '/customers/pipeline', element: <PipelinePage /> },
          {
            path: '/work/projects',
            element: (
              <PlaceholderPage
                title="Projects"
                description="Project portfolio and delivery tracking."
              />
            ),
          },
          {
            path: '/work/tasks',
            element: (
              <PlaceholderPage
                title="Tasks"
                description="Assigned work across projects and teams."
              />
            ),
          },
          {
            path: '/support/tickets',
            element: (
              <PlaceholderPage
                title="Tickets"
                description="Support queue and SLA tracking."
              />
            ),
          },
          {
            path: '/automation/workflows',
            element: (
              <PlaceholderPage
                title="Workflows"
                description="Automation rules and approvals."
              />
            ),
          },
          {
            path: '/documents',
            element: (
              <PlaceholderPage
                title="Documents"
                description="Shared document library."
              />
            ),
          },
          {
            path: '/reports',
            element: (
              <PlaceholderPage
                title="Reports"
                description="Cross-module analytics and exports."
              />
            ),
          },
          {
            path: '/settings',
            element: <SettingsLayout />,
            children: [
              { index: true, element: <Navigate to="organization" replace /> },
              { path: 'organization', element: <OrganizationPage /> },
              { path: 'branding', element: <BrandingPage /> },
              { path: 'departments', element: <DepartmentsPage /> },
              { path: 'users', element: <UsersRolesPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
