import type { ModuleId } from '@/access/modules'
import { MODULE_IDS } from '@/access/modules'

const STORAGE_KEY = 'emp-enabled-modules-v1'

const defaultEnabled: ModuleId[] = [...MODULE_IDS]

function readStored(): ModuleId[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as string[]
    return parsed.filter((id): id is ModuleId =>
      (MODULE_IDS as readonly string[]).includes(id),
    )
  } catch {
    return null
  }
}

let enabledModules: ModuleId[] = readStored() ?? [...defaultEnabled]

export function listEnabledModules(): ModuleId[] {
  return [...enabledModules]
}

export function isModuleEnabled(moduleId: ModuleId): boolean {
  return enabledModules.includes(moduleId)
}

export function setEnabledModules(next: ModuleId[]): ModuleId[] {
  enabledModules = next.filter((id) =>
    (MODULE_IDS as readonly string[]).includes(id),
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(enabledModules))
  return listEnabledModules()
}
