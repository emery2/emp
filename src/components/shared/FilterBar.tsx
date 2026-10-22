import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface FilterFacet {
  id: string
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

export interface FilterBarProps {
  search: {
    value: string
    onChange: (value: string) => void
    placeholder?: string
  }
  facets?: FilterFacet[]
  activeCount?: number
  onClearAll?: () => void
}

export function FilterBar({
  search,
  facets = [],
  activeCount = 0,
  onClearAll,
}: FilterBarProps) {
  return (
    <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-end">
        <div className="relative w-full max-w-sm">
          <Label htmlFor="collection-search" className="sr-only">
            Search
          </Label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            strokeWidth={1.5}
            aria-hidden
          />
          <Input
            id="collection-search"
            value={search.value}
            onChange={(event) => search.onChange(event.target.value)}
            placeholder={search.placeholder ?? 'Search…'}
            className="pl-9"
            aria-label="Search"
          />
        </div>
        {facets.map((facet) => (
          <div key={facet.id} className="w-full max-w-[12rem]">
            <Label htmlFor={`facet-${facet.id}`} className="mb-1 block text-xs">
              {facet.label}
            </Label>
            <select
              id={`facet-${facet.id}`}
              value={facet.value}
              onChange={(event) => facet.onChange(event.target.value)}
              className="flex h-9 w-full rounded-md border-0 border-b-2 border-transparent bg-surface-hover px-3 text-sm text-text-primary focus-visible:border-primary focus-visible:outline-none"
            >
              {facet.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
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
