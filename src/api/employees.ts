import { delay } from '@/mocks/delay'
import {
  attendanceRecords,
  employees,
  leaveRequests,
} from '@/mocks/employees'
import type {
  AttendanceRecord,
  Employee,
  LeaveRequest,
  PaginatedResult,
} from '@/types'

export const employeeKeys = {
  all: ['employees'] as const,
  list: (q: string) => [...employeeKeys.all, 'list', q] as const,
  detail: (id: string) => [...employeeKeys.all, 'detail', id] as const,
  leave: (q: string) => ['leave', q] as const,
  attendance: (q: string) => ['attendance', q] as const,
}

export async function fetchEmployees(params: {
  q?: string
  page?: number
  pageSize?: number
}): Promise<PaginatedResult<Employee>> {
  await delay()
  const q = (params.q ?? '').toLowerCase()
  const filtered = employees.filter((e) => {
    if (!q) return true
    const haystack = `${e.firstName} ${e.lastName} ${e.email} ${e.departmentName} ${e.title}`.toLowerCase()
    return haystack.includes(q)
  })
  const page = params.page ?? 0
  const pageSize = params.pageSize ?? 25
  const start = page * pageSize
  return {
    data: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
  }
}

export async function fetchEmployee(id: string): Promise<Employee> {
  await delay()
  const employee = employees.find((e) => e.id === id)
  if (!employee) throw new Error('Employee not found')
  return employee
}

export async function fetchLeaveRequests(params: {
  q?: string
}): Promise<LeaveRequest[]> {
  await delay()
  const q = (params.q ?? '').toLowerCase()
  return leaveRequests.filter((item) => {
    if (!q) return true
    return `${item.employeeName} ${item.departmentName} ${item.type}`
      .toLowerCase()
      .includes(q)
  })
}

export async function fetchAttendance(params: {
  q?: string
}): Promise<AttendanceRecord[]> {
  await delay()
  const q = (params.q ?? '').toLowerCase()
  return attendanceRecords.filter((item) => {
    if (!q) return true
    return `${item.employeeName} ${item.departmentName} ${item.status}`
      .toLowerCase()
      .includes(q)
  })
}
