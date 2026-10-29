import { describe, expect, it } from 'vitest'
import {
  getDataScope,
  hasPermission,
  primaryDashboardPath,
  resolvePermissions,
} from '@/access/evaluate'
import { demoUsers, findUserById } from '@/mocks/users'

describe('permission resolution', () => {
  it('grants board dashboard for board member', () => {
    const user = findUserById('user-board')!
    expect(hasPermission(user, 'dashboard.board.view')).toBe(true)
    expect(hasPermission(user, 'leave.request')).toBe(false)
    expect(primaryDashboardPath(user)).toBe('/app/board')
  })

  it('grants manager leave approval for head of department', () => {
    const user = findUserById('user-hod-eng')!
    expect(hasPermission(user, 'leave.approve.department')).toBe(true)
    expect(hasPermission(user, 'leave.verify.hr')).toBe(false)
    expect(getDataScope(user).scope).toBe('department')
    expect(primaryDashboardPath(user)).toBe('/app/manager')
  })

  it('applies permission overrides grant', () => {
    const user = findUserById('user-employee-override')!
    expect(hasPermission(user, 'leave.verify.hr')).toBe(true)
    expect(hasPermission(user, 'dashboard.hr.view')).toBe(true)
    expect(resolvePermissions(user).has('leave.request')).toBe(true)
  })

  it('denies inactive users', () => {
    const base = findUserById('user-employee')!
    const inactive = { ...base, isActive: false }
    expect(hasPermission(inactive, 'leave.request')).toBe(false)
  })

  it('covers expanded enterprise demo roles', () => {
    expect(demoUsers.map((u) => u.roleIds[0])).toEqual(
      expect.arrayContaining([
        'board_member',
        'ceo_executive',
        'head_of_department',
        'finance_officer',
        'hr_officer',
        'procurement_officer',
        'warehouse_manufacturing_staff',
        'sales_customer_service_staff',
        'crm_prm_project_member',
        'regular_employee',
        'system_administrator',
      ]),
    )
  })

  it('routes finance officers to the finance dashboard', () => {
    const finance = findUserById('user-finance')!
    expect(primaryDashboardPath(finance)).toBe('/app/finance')
  })
})
