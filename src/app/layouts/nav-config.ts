import {
  BarChart3,
  CalendarOff,
  CheckSquare,
  Clock,
  Contact,
  Files,
  FolderKanban,
  Kanban,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  UserPlus,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import type { FeatureFlag, Role } from '@/types'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  area:
    | 'dashboard'
    | 'people'
    | 'crm'
    | 'work'
    | 'support'
    | 'automation'
    | 'documents'
    | 'reports'
    | 'settings'
  feature?: FeatureFlag
  roles?: Role[]
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
        to: '/',
        icon: LayoutDashboard,
        area: 'dashboard',
      },
    ],
  },
  {
    label: 'People',
    items: [
      {
        label: 'Employees',
        to: '/people/employees',
        icon: Users,
        area: 'people',
      },
      {
        label: 'Leave',
        to: '/people/leave',
        icon: CalendarOff,
        area: 'people',
        feature: 'hr.leave',
      },
      {
        label: 'Attendance',
        to: '/people/attendance',
        icon: Clock,
        area: 'people',
        feature: 'hr.attendance',
      },
    ],
  },
  {
    label: 'Customers',
    items: [
      {
        label: 'Leads',
        to: '/customers/leads',
        icon: UserPlus,
        area: 'crm',
        feature: 'crm.enabled',
      },
      {
        label: 'Contacts',
        to: '/customers/contacts',
        icon: Contact,
        area: 'crm',
        feature: 'crm.enabled',
      },
      {
        label: 'Pipeline',
        to: '/customers/pipeline',
        icon: Kanban,
        area: 'crm',
        feature: 'crm.enabled',
      },
    ],
  },
  {
    label: 'Work',
    items: [
      {
        label: 'Projects',
        to: '/work/projects',
        icon: FolderKanban,
        area: 'work',
      },
      {
        label: 'Tasks',
        to: '/work/tasks',
        icon: CheckSquare,
        area: 'work',
      },
    ],
  },
  {
    label: 'Support',
    items: [
      {
        label: 'Tickets',
        to: '/support/tickets',
        icon: LifeBuoy,
        area: 'support',
      },
    ],
  },
  {
    label: 'Automation',
    items: [
      {
        label: 'Workflows',
        to: '/automation/workflows',
        icon: Workflow,
        area: 'automation',
        feature: 'automation.beta',
      },
    ],
  },
  {
    items: [
      {
        label: 'Documents',
        to: '/documents',
        icon: Files,
        area: 'documents',
      },
      {
        label: 'Reports',
        to: '/reports',
        icon: BarChart3,
        area: 'reports',
      },
      {
        label: 'Settings',
        to: '/settings',
        icon: Settings,
        area: 'settings',
      },
    ],
  },
]

export const settingsNav = [
  { label: 'Organization', to: '/settings/organization' },
  { label: 'Branding', to: '/settings/branding' },
  { label: 'Departments', to: '/settings/departments' },
  { label: 'Users & roles', to: '/settings/users' },
]
