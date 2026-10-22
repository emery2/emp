export type Role =
  | 'super_admin'
  | 'org_admin'
  | 'dept_manager'
  | 'supervisor'
  | 'employee'
  | 'external'

export type FeatureFlag =
  | 'crm.enabled'
  | 'hr.leave'
  | 'hr.attendance'
  | 'automation.beta'
  | 'reports.advanced'

export type StatusBadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'

export interface Tenant {
  id: string
  name: string
  primaryColor: string
  logoUrl?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  departmentId?: string
  departmentName?: string
  avatarUrl?: string
  tenantId: string
}

export interface Department {
  id: string
  name: string
  managerName: string
  employeeCount: number
}

export interface Employee {
  id: string
  employeeNumber: string
  firstName: string
  lastName: string
  email: string
  title: string
  departmentId: string
  departmentName: string
  managerName?: string
  status: 'active' | 'on_leave' | 'inactive'
  hireDate: string
  location: string
  phone: string
}

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  departmentName: string
  type: 'vacation' | 'sick' | 'personal' | 'unpaid'
  startDate: string
  endDate: string
  days: number
  status: 'pending' | 'approved' | 'rejected'
  reason?: string
}

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  departmentName: string
  date: string
  checkIn?: string
  checkOut?: string
  status: 'present' | 'late' | 'absent' | 'remote'
  hours: number
}

export interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  source: string
  status: 'new' | 'contacted' | 'qualified' | 'disqualified'
  ownerName: string
  estimatedValue: number
  createdAt: string
}

export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  title: string
  ownerName: string
  status: 'active' | 'inactive'
  lifetimeValue: number
  lastActivityAt: string
  notes?: string
}

export interface PipelineStage {
  id: string
  title: string
  order: number
  wipLimit?: number
}

export interface Deal {
  id: string
  title: string
  company: string
  stageId: string
  value: number
  ownerName: string
  probability: number
  expectedCloseDate: string
  status?: StatusBadgeVariant
}

export interface OrgSettings {
  name: string
  legalName: string
  website: string
  industry: string
  timezone: string
  address: string
}

export interface BrandingSettings {
  primaryColor: string
  logoUrl?: string
}

export interface OrgUser {
  id: string
  name: string
  email: string
  role: Role
  departmentName: string
  status: 'active' | 'invited' | 'disabled'
}

export interface DashboardStats {
  headcount: number
  headcountDelta: string
  openLeave: number
  openLeaveDelta: string
  pipelineValue: number
  pipelineDelta: string
  openTickets: number
  openTicketsDelta: string
}

export interface ChartPoint {
  label: string
  value: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
