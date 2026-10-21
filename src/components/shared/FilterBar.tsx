import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface FilterBarProps {
  search: {
    value: string
    onChange: (value: string) => void
    placeholder?: string
  }
  activeCount?: number
  onClearAll?: () => void
}

export function FilterBar({ search, activeCount = 0, onClearAll }: FilterBarProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          strokeWidth={1.5}
          aria-hidden
        />
        <Input
          value={search.value}
          onChange={(event) => search.onChange(event.target.value)}
          placeholder={search.placeholder ?? 'Search…'}
          className="pl-9"
          aria-label="Search"
        />
      </div>
      {activeCount > 0 && onClearAll ? (
        <Button variant="ghost" size="sm" onClick={onClearAll}>
          <X className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          Clear all ({activeCount})
        </Button>
      ) : null}
    </div>
  )
}
