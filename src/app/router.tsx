import { Navigate, createBrowserRouter } from 'react-router-dom'
import { RequirePermission } from '@/access/guards'
import { RequireModule } from '@/access/module-gate'
import { AppShell } from '@/app/layouts/AppShell'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { GuestRoute } from '@/app/routes/GuestRoute'
import { ProtectedRoute } from '@/app/routes/ProtectedRoute'
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage'
import { LoginPage } from '@/features/auth/LoginPage'
import { ResetPasswordPage } from '@/features/auth/ResetPasswordPage'
import { CalendarPage } from '@/features/calendar/CalendarPage'
import { OpportunitiesPage } from '@/features/crm/OpportunitiesPage'
import { OpportunityDetailPage } from '@/features/crm/OpportunityDetailPage'
import { LeadsPage } from '@/features/customers/LeadsPage'
import { AdminDashboard } from '@/features/dashboard/AdminDashboard'
import { BoardDashboard } from '@/features/dashboard/BoardDashboard'
import { DashboardRedirect } from '@/features/dashboard/DashboardRedirect'
import { EmployeeDashboard } from '@/features/dashboard/EmployeeDashboard'
import { ExecutiveDashboard } from '@/features/dashboard/ExecutiveDashboard'
import { FinanceDashboard } from '@/features/dashboard/FinanceDashboard'
import { HrDashboard } from '@/features/dashboard/HrDashboard'
import { ManagerDashboard } from '@/features/dashboard/ManagerDashboard'
import { OperationsDashboard } from '@/features/dashboard/OperationsDashboard'
import { QuotationDetailPage } from '@/features/erp/QuotationDetailPage'
import { QuotationsPage } from '@/features/erp/QuotationsPage'
import { CustomersPage } from '@/features/marketing/CustomersPage'
import { HomePage } from '@/features/marketing/HomePage'
import { MarketingLayout } from '@/features/marketing/MarketingLayout'
import {
  CompanyPage,
  ContactPage,
  EventsPage,
  IndustriesPage,
  LearningPage,
  SupportPage,
} from '@/features/marketing/MarketingStubPage'
import { ProductDetailPage } from '@/features/marketing/ProductDetailPage'
import { ProductsPage } from '@/features/marketing/ProductsPage'
import { WhyEmpPage } from '@/features/marketing/WhyEmpPage'
import { LeaveDetailPage } from '@/features/leave/LeaveDetailPage'
import { LeaveHistoryPage } from '@/features/leave/LeaveHistoryPage'
import { LeaveHrQueuePage } from '@/features/leave/LeaveHrQueuePage'
import { LeaveManagerQueuePage } from '@/features/leave/LeaveManagerQueuePage'
import { LeaveRequestPage } from '@/features/leave/LeaveRequestPage'
import { EmployeeDetailPage } from '@/features/people/EmployeeDetailPage'
import { EmployeeListPage } from '@/features/people/EmployeeListPage'
import { PlaceholderPage } from '@/features/placeholders/PlaceholderPage'
import { ProfilePage } from '@/features/profile/ProfilePage'
import { BrandingPage } from '@/features/settings/BrandingPage'
import { DepartmentsPage } from '@/features/settings/DepartmentsPage'
import { ModulesPage } from '@/features/settings/ModulesPage'
import { OrganizationPage } from '@/features/settings/OrganizationPage'
import { SettingsLayout } from '@/features/settings/SettingsLayout'
import { UsersRolesPage } from '@/features/settings/UsersRolesPage'
import { AccessDeniedPage } from '@/features/system/AccessDeniedPage'
import { NotFoundPage } from '@/features/system/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/products/:slug', element: <ProductDetailPage /> },
      { path: '/why-emp', element: <WhyEmpPage /> },
      { path: '/customers', element: <CustomersPage /> },
      { path: '/industries', element: <IndustriesPage /> },
      { path: '/events', element: <EventsPage /> },
      { path: '/learning', element: <LearningPage /> },
      { path: '/support', element: <SupportPage /> },
      { path: '/company', element: <CompanyPage /> },
      { path: '/contact', element: <ContactPage /> },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/forgot-password', element: <ForgotPasswordPage /> },
          { path: '/reset-password', element: <ResetPasswordPage /> },
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
          { path: '/app', element: <DashboardRedirect /> },
          {
            element: <RequirePermission permission="dashboard.board.view" />,
            children: [{ path: '/app/board', element: <BoardDashboard /> }],
          },
          {
            element: (
              <RequirePermission permission="dashboard.executive.view" />
            ),
            children: [
              { path: '/app/executive', element: <ExecutiveDashboard /> },
            ],
          },
          {
            element: <RequirePermission permission="dashboard.admin.view" />,
            children: [{ path: '/app/admin', element: <AdminDashboard /> }],
          },
          {
            element: <RequirePermission permission="dashboard.hr.view" />,
            children: [{ path: '/app/hr', element: <HrDashboard /> }],
          },
          {
            element: <RequirePermission permission="dashboard.finance.view" />,
            children: [
              { path: '/app/finance', element: <FinanceDashboard /> },
            ],
          },
          {
            element: (
              <RequirePermission permission="dashboard.operations.view" />
            ),
            children: [
              { path: '/app/operations', element: <OperationsDashboard /> },
            ],
          },
          {
            element: <RequirePermission permission="dashboard.manager.view" />,
            children: [
              { path: '/app/manager', element: <ManagerDashboard /> },
            ],
          },
          {
            element: <RequirePermission permission="dashboard.employee.view" />,
            children: [
              { path: '/app/employee', element: <EmployeeDashboard /> },
            ],
          },
          {
            element: <RequirePermission permission="calendar.view" />,
            children: [{ path: '/calendar', element: <CalendarPage /> }],
          },
          {
            element: <RequireModule moduleId="hcm" />,
            children: [
              {
                element: <RequirePermission permission="employees.view" />,
                children: [
                  { path: '/people/employees', element: <EmployeeListPage /> },
                  {
                    path: '/people/employees/:id',
                    element: <EmployeeDetailPage />,
                  },
                ],
              },
              {
                element: <RequirePermission permission="leave.request" />,
                children: [
                  { path: '/leave/request', element: <LeaveRequestPage /> },
                  { path: '/leave/mine', element: <LeaveHistoryPage /> },
                ],
              },
              {
                element: (
                  <RequirePermission permission="leave.approve.department" />
                ),
                children: [
                  {
                    path: '/leave/manager',
                    element: <LeaveManagerQueuePage />,
                  },
                ],
              },
              {
                element: <RequirePermission permission="leave.verify.hr" />,
                children: [{ path: '/leave/hr', element: <LeaveHrQueuePage /> }],
              },
              {
                element: (
                  <RequirePermission
                    permissions={[
                      'leave.request',
                      'leave.approve.department',
                      'leave.verify.hr',
                    ]}
                  />
                ),
                children: [
                  { path: '/leave/:id', element: <LeaveDetailPage /> },
                ],
              },
            ],
          },
          {
            element: <RequireModule moduleId="crm" />,
            children: [
              {
                element: (
                  <RequirePermission
                    permissions={['crm.leads.view', 'crm.leads.manage']}
                  />
                ),
                children: [
                  { path: '/customers/leads', element: <LeadsPage /> },
                ],
              },
              {
                element: (
                  <RequirePermission
                    permissions={[
                      'crm.opportunities.view',
                      'crm.opportunities.manage',
                    ]}
                  />
                ),
                children: [
                  {
                    path: '/crm/opportunities',
                    element: <OpportunitiesPage />,
                  },
                  {
                    path: '/crm/opportunities/:id',
                    element: <OpportunityDetailPage />,
                  },
                ],
              },
            ],
          },
          {
            element: <RequireModule moduleId="erp" />,
            children: [
              {
                element: (
                  <RequirePermission
                    permissions={[
                      'erp.quotations.view',
                      'erp.quotations.manage',
                    ]}
                  />
                ),
                children: [
                  { path: '/erp/quotations', element: <QuotationsPage /> },
                  {
                    path: '/erp/quotations/:id',
                    element: <QuotationDetailPage />,
                  },
                ],
              },
              {
                element: (
                  <RequirePermission permission="erp.purchasing.view" />
                ),
                children: [
                  {
                    path: '/erp/purchasing',
                    element: (
                      <PlaceholderPage
                        title="Purchasing"
                        description="Purchase requests linked to SCM suppliers (next increment)."
                      />
                    ),
                  },
                ],
              },
            ],
          },
          {
            element: <RequireModule moduleId="scm" />,
            children: [
              {
                element: (
                  <RequirePermission permission="scm.suppliers.view" />
                ),
                children: [
                  {
                    path: '/scm/suppliers',
                    element: (
                      <PlaceholderPage
                        title="Suppliers"
                        description="Supplier master data for procurement and receipts."
                      />
                    ),
                  },
                ],
              },
              {
                element: (
                  <RequirePermission permission="scm.inventory.view" />
                ),
                children: [
                  {
                    path: '/scm/inventory',
                    element: (
                      <PlaceholderPage
                        title="Inventory"
                        description="Stock movements and receipts (next increment)."
                      />
                    ),
                  },
                ],
              },
              {
                element: (
                  <RequirePermission permission="scm.production.view" />
                ),
                children: [
                  {
                    path: '/scm/production',
                    element: (
                      <PlaceholderPage
                        title="Production"
                        description="Work orders, materials, and finished goods (next increment)."
                      />
                    ),
                  },
                ],
              },
            ],
          },
          {
            element: <RequireModule moduleId="cx" />,
            children: [
              {
                element: (
                  <RequirePermission
                    permissions={['cx.cases.view', 'cx.cases.manage']}
                  />
                ),
                children: [
                  {
                    path: '/cx/cases',
                    element: (
                      <PlaceholderPage
                        title="Service cases"
                        description="CX cases linked to customers and order history."
                      />
                    ),
                  },
                ],
              },
            ],
          },
          {
            element: <RequireModule moduleId="prm" />,
            children: [
              {
                element: (
                  <RequirePermission permission="prm.partners.manage" />
                ),
                children: [
                  {
                    path: '/partners',
                    element: (
                      <PlaceholderPage
                        title="Partners"
                        description="Partner relationship management and referrals."
                      />
                    ),
                  },
                ],
              },
            ],
          },
          {
            element: <RequireModule moduleId="projects" />,
            children: [
              {
                element: <RequirePermission permission="projects.manage" />,
                children: [
                  {
                    path: '/work/projects',
                    element: (
                      <PlaceholderPage
                        title="Projects"
                        description="Project portfolio and delivery tracking."
                      />
                    ),
                  },
                ],
              },
            ],
          },
          {
            element: <RequireModule moduleId="epm" />,
            children: [
              {
                element: <RequirePermission permission="epm.budgets.view" />,
                children: [
                  {
                    path: '/epm/budgets',
                    element: (
                      <PlaceholderPage
                        title="Budgets"
                        description="EPM budgets consuming authorized operational metrics."
                      />
                    ),
                  },
                ],
              },
            ],
          },
          {
            element: (
              <RequirePermission
                permissions={['finance.ar.view', 'finance.ap.view']}
              />
            ),
            children: [
              {
                path: '/finance/ar',
                element: (
                  <PlaceholderPage
                    title="Accounts receivable"
                    description="AR overview for finance officers (next increment)."
                  />
                ),
              },
              {
                path: '/finance/ap',
                element: (
                  <PlaceholderPage
                    title="Accounts payable"
                    description="AP overview for finance officers (next increment)."
                  />
                ),
              },
            ],
          },
          {
            element: (
              <RequirePermission permission="reports.organization.view" />
            ),
            children: [
              {
                path: '/reports',
                element: (
                  <PlaceholderPage
                    title="Reports"
                    description="Organization reports and exports."
                  />
                ),
              },
            ],
          },
          {
            element: (
              <RequirePermission
                permissions={[
                  'settings.view',
                  'access.roles.manage',
                  'modules.configure',
                ]}
              />
            ),
            children: [
              {
                path: '/settings',
                element: <SettingsLayout />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="organization" replace />,
                  },
                  { path: 'organization', element: <OrganizationPage /> },
                  { path: 'branding', element: <BrandingPage /> },
                  { path: 'departments', element: <DepartmentsPage /> },
                  {
                    element: (
                      <RequirePermission permission="access.roles.manage" />
                    ),
                    children: [
                      { path: 'users', element: <UsersRolesPage /> },
                    ],
                  },
                  {
                    element: (
                      <RequirePermission permission="modules.configure" />
                    ),
                    children: [
                      { path: 'modules', element: <ModulesPage /> },
                    ],
                  },
                ],
              },
            ],
          },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/access-denied', element: <AccessDeniedPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
