import type { BrandingSettings } from '@/types'

const STORAGE_KEY = 'emp-branding-v1'

export function readStoredBranding(): BrandingSettings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as BrandingSettings) : null
  } catch {
    return null
  }
}

export function writeStoredBranding(next: BrandingSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function applyBrandingToDocument(branding: BrandingSettings): void {
  document.documentElement.style.setProperty('--primary', branding.primaryColor)
  document.documentElement.style.setProperty('--ring', branding.primaryColor)
  document.documentElement.style.setProperty('--info', branding.primaryColor)
  document.documentElement.style.setProperty(
    '--sidebar-active-accent',
    branding.primaryColor,
  )
  document.documentElement.classList.add('tenant-branded')

  if (branding.logoUrl) {
    document.documentElement.style.setProperty(
      '--tenant-logo-url',
      `url(${branding.logoUrl})`,
    )
  } else {
    document.documentElement.style.removeProperty('--tenant-logo-url')
  }
}
