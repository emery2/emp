import { delay } from '@/mocks/delay'
import {
  isModuleEnabled,
  listEnabledModules,
  setEnabledModules,
} from '@/mocks/modules'
import type { ModuleId } from '@/access/modules'

export const moduleKeys = {
  all: ['modules'] as const,
  enabled: ['modules', 'enabled'] as const,
}

export async function fetchEnabledModules(): Promise<ModuleId[]> {
  await delay(100)
  return listEnabledModules()
}

export async function updateEnabledModules(
  next: ModuleId[],
): Promise<ModuleId[]> {
  await delay(200)
  return setEnabledModules(next)
}

export async function checkModuleEnabled(moduleId: ModuleId): Promise<boolean> {
  await delay(50)
  return isModuleEnabled(moduleId)
}
