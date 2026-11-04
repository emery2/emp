import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const featuresRoot = path.resolve(__dirname, '../features')

function listFiles(dir: string): string[] {
  const entries = readdirSync(dir)
  const files: string[] = []
  for (const entry of entries) {
    const full = path.join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) {
      files.push(...listFiles(full))
    } else if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith('.test.ts')) {
      files.push(full)
    }
  }
  return files
}

function featureNameFromPath(file: string): string | null {
  const rel = path.relative(featuresRoot, file)
  if (rel.startsWith('..')) return null
  const top = rel.split(path.sep)[0]
  return top || null
}

const ALIAS_FEATURE_RE = /from\s+['"]@\/features\/([a-zA-Z0-9_-]+)/g

describe('import boundary', () => {
  it('feature folders do not import other feature folders', () => {
    const files = listFiles(featuresRoot)
    const violations: string[] = []

    for (const file of files) {
      const owner = featureNameFromPath(file)
      if (!owner) continue
      const source = readFileSync(file, 'utf8')
      for (const match of source.matchAll(ALIAS_FEATURE_RE)) {
        const imported = match[1]
        if (imported && imported !== owner) {
          violations.push(
            `${path.relative(featuresRoot, file)} imports @/features/${imported}`,
          )
        }
      }
      const relImportRe = /from\s+['"](\.\.[^'"]+)['"]/g
      for (const match of source.matchAll(relImportRe)) {
        const spec = match[1]
        if (!spec) continue
        const resolved = path.resolve(path.dirname(file), spec)
        const other = featureNameFromPath(resolved)
        if (other && other !== owner) {
          violations.push(
            `${path.relative(featuresRoot, file)} relative-imports feature ${other}`,
          )
        }
      }
    }

    expect(violations, violations.join('\n')).toEqual([])
  })
})
