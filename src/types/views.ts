export type ViewMode =
  | 'list'
  | 'grid'
  | 'tile'
  | 'kanban'
  | 'chart'
  | 'timeline'
  | 'split'
  | 'custom'

export type SortDirection = 'asc' | 'desc'

export interface SortOption {
  field: string
  label: string
}

export interface SortState {
  field: string
  direction: SortDirection
}

export interface ViewModeMeta {
  id: ViewMode
  label: string
}

export const VIEW_MODE_META: Record<ViewMode, ViewModeMeta> = {
  list: { id: 'list', label: 'List' },
  grid: { id: 'grid', label: 'Grid' },
  tile: { id: 'tile', label: 'Tile' },
  kanban: { id: 'kanban', label: 'Kanban' },
  chart: { id: 'chart', label: 'Chart' },
  timeline: { id: 'timeline', label: 'Timeline' },
  split: { id: 'split', label: 'Split' },
  custom: { id: 'custom', label: 'Custom' },
}
