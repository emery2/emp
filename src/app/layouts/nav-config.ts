import {
  BarChart3,
  Boxes,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Factory,
  FileText,
  FileWarning,
  FolderKanban,
  Handshake,
  Headphones,
  LayoutDashboard,
  Package,
  Settings,
  ShieldAlert,
  ShoppingCart,
  Truck,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { ModuleId } from '@/access/modules'
import type { Permission } from '@/access/permissions'
import type { FeatureKey } from '@/modules/feature-keys'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  permissions: Permission[]
  module?: ModuleId
  feature?: FeatureKey
}

export interface NavGroup {
  label?: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    items: [
      {
        label: 'Dashboard',
        to: '/app',
        icon: LayoutDashboard,
        permissions: [
          'dashboard.board.view',
          'dashboard.executive.view',
          'dashboard.manager.view',
          'dashboard.hr.view',
          'dashboard.employee.view',
          'dashboard.admin.view',
          'dashboard.finance.view',
          'dashboard.operations.view',
        ],
      },
      {
        label: 'Calendar',
        to: '/calendar',
        icon: CalendarDays,
        permissions: ['calendar.view'],
      },
    ],
  },
  {
    label: 'HR',
    items: [
      {
        label: 'Employees',
        to: '/people/employees',
        icon: Users,
        permissions: ['employees.view'],
        module: 'hr',
      },
      {
        label: 'Request leave',
        to: '/leave/request',
        icon: ClipboardList,
        permissions: ['leave.request'],
        module: 'hr',
        feature: 'hr.leave',
      },
      {
        label: 'My leave',
        to: '/leave/mine',
        icon: ClipboardList,
        permissions: ['leave.request'],
        module: 'hr',
        feature: 'hr.leave',
      },
      {
        label: 'Manager approvals',
        to: '/leave/manager',
        icon: ClipboardCheck,
        permissions: ['leave.approve.department'],
        module: 'hr',
        feature: 'hr.leave',
      },
      {
        label: 'HR verification',
        to: '/leave/hr',
        icon: FileWarning,
        permissions: ['leave.verify.hr'],
        module: 'hr',
        feature: 'hr.leave',
      },
      {
        label: 'Profile approvals',
        to: '/profile/hr-queue',
        icon: ClipboardCheck,
        permissions: ['profile.approve.hr'],
        module: 'hr',
        feature: 'hr.profile_self_service',
      },
    ],
  },
  {
    label: 'CRM / CX',
    items: [
      {
        label: 'Leads',
        to: '/customers/leads',
        icon: UserPlus,
        permissions: ['crm.leads.view', 'crm.leads.manage'],
        module: 'crm',
      },
      {
        label: 'Opportunities',
        to: '/crm/opportunities',
        icon: BriefcaseBusiness,
        permissions: ['crm.opportunities.view', 'crm.opportunities.manage'],
        module: 'crm',
      },
      {
        label: 'Service cases',
        to: '/cx/cases',
        icon: Headphones,
        permissions: ['cx.cases.view', 'cx.cases.manage'],
        module: 'cx',
      },
    ],
  },
  {
    label: 'ERP / SCM',
    items: [
      {
        label: 'Quotations',
        to: '/erp/quotations',
        icon: FileText,
        permissions: ['erp.quotations.view', 'erp.quotations.manage'],
        module: 'erp',
      },
      {
        label: 'Purchasing',
        to: '/erp/purchasing',
        icon: ShoppingCart,
        permissions: ['erp.purchasing.view'],
        module: 'erp',
      },
      {
        label: 'Suppliers',
        to: '/scm/suppliers',
        icon: Truck,
        permissions: ['scm.suppliers.view'],
        module: 'scm',
      },
      {
        label: 'Inventory',
        to: '/scm/inventory',
        icon: Boxes,
        permissions: ['scm.inventory.view'],
        module: 'scm',
      },
      {
        label: 'Production',
        to: '/scm/production',
        icon: Factory,
        permissions: ['scm.production.view'],
        module: 'scm',
      },
    ],
  },
  {
    label: 'Growth',
    items: [
      {
        label: 'Partners',
        to: '/partners',
        icon: Handshake,
        permissions: ['prm.partners.manage'],
        module: 'prm',
      },
      {
        label: 'Projects',
        to: '/work/projects',
        icon: FolderKanban,
        permissions: ['projects.manage'],
        module: 'projects',
      },
      {
        label: 'Budgets',
        to: '/epm/budgets',
        icon: Package,
        permissions: ['epm.budgets.view'],
        module: 'epm',
      },
    ],
  },
  {
    items: [
      {
        label: 'Reports',
        to: '/reports',
        icon: BarChart3,
        permissions: ['reports.organization.view'],
      },
      {
        label: 'Access & roles',
        to: '/settings/users',
        icon: ShieldAlert,
        permissions: ['access.roles.manage'],
      },
      {
        label: 'Settings',
        to: '/settings',
        icon: Settings,
        permissions: ['settings.view', 'modules.configure'],
      },
    ],
  },
]

export interface Crumb {
  label: string
  href?: string
}

export function crumbsForPath(pathname: string): Crumb[] {
  if (pathname.startsWith('/crm/opportunities')) {
    return [{ label: 'CRM' }, { label: 'Opportunities' }]
  }
  if (pathname.startsWith('/erp/quotations')) {
    return [{ label: 'ERP' }, { label: 'Quotations' }]
  }
  if (pathname.startsWith('/erp/purchasing')) {
    return [{ label: 'ERP' }, { label: 'Purchasing' }]
  }
  if (pathname.startsWith('/scm/')) {
    return [{ label: 'SCM' }, { label: 'Operations' }]
  }
  if (pathname.startsWith('/cx/')) return [{ label: 'CX' }, { label: 'Cases' }]
  if (pathname.startsWith('/epm/')) return [{ label: 'EPM' }, { label: 'Budgets' }]
  if (pathname.startsWith('/finance/')) {
    return [{ label: 'Finance' }]
  }
  if (pathname.startsWith('/leave/request')) {
    return [
      { label: 'People', href: '/people/employees' },
      { label: 'Request leave' },
    ]
  }
  if (pathname.startsWith('/leave/mine')) {
    return [{ label: 'People' }, { label: 'My leave' }]
  }
  if (pathname.startsWith('/leave/manager')) {
    return [{ label: 'People' }, { label: 'Manager approvals' }]
  }
  if (pathname.startsWith('/leave/hr')) {
    return [{ label: 'People' }, { label: 'HR verification' }]
  }
  if (pathname.startsWith('/leave/')) {
    return [{ label: 'People' }, { label: 'Leave detail' }]
  }
  if (pathname.startsWith('/people')) {
    return [{ label: 'People' }, { label: 'Employees' }]
  }
  if (pathname.startsWith('/calendar')) return [{ label: 'Calendar' }]
  if (pathname.startsWith('/profile')) return [{ label: 'Profile' }]
  if (pathname.startsWith('/settings')) return [{ label: 'Settings' }]
  if (pathname.startsWith('/app')) return [{ label: 'Dashboard' }]
  return [{ label: 'EMP' }]
}
