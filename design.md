# EMP Design System

**Enterprise Management Platform (EMP)** — single source of truth for all UI decisions.

Stack: React 18 + Vite + TypeScript, Tailwind CSS, shadcn/ui, React Query, React Router, Lucide icons.

This document governs every visual and interaction choice. If something is missing, update this file before changing code. No hardcoded colors or spacing in components — tokens only.

---

## Visual language: SAP Analytics Cloud / Fiori Horizon

EMP follows the interaction and surface grammar of **SAP Analytics Cloud (SAC)** and **SAP Fiori Horizon** — not a pixel clone.

| Pattern | Rule |
|---------|------|
| Flat analytic canvas | Page `background` one step darker than content tiles; KPI blocks are solid-fill tiles |
| Shell chrome | Fixed **ShellBar** (top) + **SideNavigation** (left); content swaps via React Router `Outlet` |
| Content-first charts | Solid series fills only; hairline gridlines; compact legends; no glow, 3D, or gradient fills |
| Tables as primary object | Full-width grid, row hover via `surface-hover`, headers on `surface` |

### Surface rules (hard prohibitions)

| Avoid | Use instead |
|-------|-------------|
| CSS `linear-gradient` / `radial-gradient` (UI, charts, auth) | Solid `background` / `surface` tokens |
| Decorative borders on every card/tile (`border border-*`) | Tone contrast (`background` vs `surface`) + padding |
| Outline/stroke as primary button or tile treatment | Solid primary + ghost/text secondary |
| Heavy shadows on cards (`shadow-lg` at rest) | `shadow-none` on tiles; `shadow-sm`/`shadow-md` only on floating layers |
| Custom SVG illustrations with thick strokes | Lucide icon (`strokeWidth={1.5}`, `text-muted`) + short copy |
| Glassmorphism, neon accents, skeuomorphism | Horizon neutrals + one brand accent |

**Functional dividers (allowed):** 1px `border-b` on ShellBar, table header rule, and section `Separator` — token `divider` only.

**Form fields (Horizon):** filled inputs on `surface-hover`; no full rectangular outline; focus = 2px bottom edge `primary`; invalid = `danger` bottom edge + message.

### React + shadcn conventions

- Styling via Tailwind + CSS variables only. Ban `bg-gradient-*` utilities.
- **Recharts:** solid `fill` from chart palette; `stroke` only for line series (1–2px data lines); no gradient `<defs>`.
- **shadcn Card:** default `border-0 shadow-none`.
- **shadcn Button:** variants `default`, `ghost`, `destructive` only. `outline` is disallowed except rare tertiary actions explicitly documented per screen.
- Composition: small presentational components; page templates as route-level components with slots (`header`, `toolbar`, `children`).

---

## 1. Design principles

| # | Principle | Meaning in EMP |
|---|-----------|----------------|
| 1 | **Flat analytic surfaces** | SAC-style tiles on a neutral canvas; separation by tone, not borders, gradients, or elevation. |
| 2 | **Density with clarity** | Default table row height 40px; metadata in `text-muted`; KPI numbers large, labels caption-sized. |
| 3 | **Progressive disclosure** | List → sheet → detail; advanced filters in a collapsible panel (Horizon “adapt filters”). |
| 4 | **Token-only styling** | No raw hex in TSX; Tailwind maps to CSS variables; chart colors from named series tokens. |
| 5 | **Role-aware chrome** | Nav and actions match RBAC; shell stays stable — content swaps via React Router `Outlet`. |

---

## 2. Brand and theming

### Mechanism

- `:root` and `.dark` define semantic tokens (§3).
- `.tenant-branded` on `<html>` (or app root) sets tenant overrides:
  - `--brand-primary` (HSL components for Tailwind `hsl(var(--primary))`)
  - `--brand-primary-foreground`
  - `--tenant-logo-url` (optional; ShellBar / SideNavigation `<img>` or CSS background slot)
- `ThemeProvider`: `light` | `dark` | `system`; persist in `localStorage` key `emp-theme`.
- Tenant brand loaded from mock org settings (later API); applied on login and tenant switch.

### Default tenant (NORF placeholder)

| Property | Value |
|----------|--------|
| Primary (light) | `#0070F2` (SAP Horizon Blue) |
| Primary (dark) | `#4DB1FF` |
| Logo slot collapsed | 32×32 |
| Logo slot expanded | max 120×32 |
| Logo treatment | Flat mark on `surface` — no plate, no gradient |

### shadcn CSS variable mapping

| shadcn token | EMP semantic | Notes |
|--------------|--------------|--------|
| `--background` | `background` | App canvas |
| `--foreground` | `text-primary` | Default text |
| `--card` | `surface` | Tiles / panels |
| `--card-foreground` | `text-primary` | |
| `--popover` | `surface-elevated` | Floating layers |
| `--popover-foreground` | `text-primary` | |
| `--primary` | `primary` | Brand / actions |
| `--primary-foreground` | `primary-foreground` | |
| `--secondary` | `surface-hover` | Secondary fills |
| `--secondary-foreground` | `text-primary` | |
| `--muted` | `surface-hover` | Muted fills |
| `--muted-foreground` | `text-muted` | |
| `--accent` | `sidebar-active` | Accent fills |
| `--accent-foreground` | `text-primary` | |
| `--destructive` | `danger` | |
| `--destructive-foreground` | `primary-foreground` (light) / `text-primary` (dark) | |
| `--border` | `divider` | Structural only |
| `--input` | `divider` | Input underline / edge |
| `--ring` | `ring` | Focus |

`tailwind.config.ts` extends `theme.extend.colors` to reference these CSS variables only (no raw hex in config values beyond CSS var wiring).

---

## 3. Color tokens

All values are exact hex. Components use Tailwind semantic classes that resolve to these tokens (e.g. `bg-background`, `text-text-primary`, `bg-primary`).

### Light theme

| Token | Hex | Usage |
|-------|-----|--------|
| `background` | `#F5F6F7` | App canvas (Horizon shell background) |
| `surface` | `#FFFFFF` | Tiles, tables, sidebar, shell bar |
| `surface-hover` | `#EBEBEB` | Table row hover, nav hover, filled inputs |
| `surface-elevated` | `#FFFFFF` | Dialog / popover (float via shadow only) |
| `divider` | `#D9D9D9` | Shell bottom, table header rule, section separators |
| `text-primary` | `#32363A` | Headings, primary cell text |
| `text-secondary` | `#6A6D70` | Descriptions, metadata |
| `text-muted` | `#89919A` | Placeholders, disabled labels |
| `primary` | `#0070F2` | Buttons, links, active nav indicator |
| `primary-hover` | `#0064D9` | Primary hover |
| `primary-foreground` | `#FFFFFF` | Text on primary |
| `success` | `#107E3E` | SAP semantic positive |
| `success-subtle` | `#F5FAF6` | Success badge / tile tint |
| `warning` | `#E9730C` | SAP semantic warning |
| `warning-subtle` | `#FEF7F1` | Warning badge bg |
| `danger` | `#BB0000` | Errors, rejected, overdue |
| `danger-subtle` | `#FFECEC` | Danger badge bg |
| `info` | `#0070F2` | Informational (same as primary) |
| `info-subtle` | `#EDF6FF` | Info badge bg |
| `ring` | `#0070F2` | Focus ring (2px solid, no offset glow) |
| `sidebar-bg` | `#FFFFFF` | Side navigation panel |
| `sidebar-active` | `#EBF5FE` | Active nav item fill |
| `sidebar-active-accent` | `#0070F2` | 3px left bar on active item (only accent stroke in chrome) |
| `chart-grid` | `#E5E5E5` | Chart gridlines |
| `disabled` | `#A9B4BE` | Disabled control chrome |
| `disabled-foreground` | `#89919A` | Disabled text |

### Dark theme

| Token | Hex | Usage |
|-------|-----|--------|
| `background` | `#1D2D3E` | App canvas (Horizon dark shell) |
| `surface` | `#253548` | Tiles, tables, panels |
| `surface-hover` | `#2E4054` | Row / nav hover, filled inputs |
| `surface-elevated` | `#2E4054` | Dialog / popover |
| `divider` | `#3A4552` | Structural dividers only |
| `text-primary` | `#F5F6F7` | Primary text |
| `text-secondary` | `#A9B4BE` | Secondary |
| `text-muted` | `#8396A8` | Muted |
| `primary` | `#4DB1FF` | Primary actions |
| `primary-hover` | `#89D1FF` | Hover |
| `primary-foreground` | `#1D2D3E` | On primary buttons |
| `success` | `#6CE39C` | Success |
| `success-subtle` | `#1C3829` | Success badge bg |
| `warning` | `#FFC933` | Warning |
| `warning-subtle` | `#3D3319` | Warning badge bg |
| `danger` | `#FF8888` | Danger |
| `danger-subtle` | `#3D2020` | Danger badge bg |
| `info` | `#4DB1FF` | Info |
| `info-subtle` | `#1A3A52` | Info badge bg |
| `ring` | `#4DB1FF` | Focus ring |
| `sidebar-bg` | `#253548` | Side navigation |
| `sidebar-active` | `#1A3A52` | Active nav fill |
| `sidebar-active-accent` | `#4DB1FF` | 3px left active indicator |
| `chart-grid` | `#3A4552` | Chart gridlines |
| `disabled` | `#5B738B` | Disabled control chrome |
| `disabled-foreground` | `#8396A8` | Disabled text |

### Chart series (solid fills only)

| Series | Light | Dark |
|--------|-------|------|
| `chart-1` | `#0070F2` | `#4DB1FF` |
| `chart-2` | `#107E3E` | `#6CE39C` |
| `chart-3` | `#E9730C` | `#FFC933` |
| `chart-4` | `#BB0000` | `#FF8888` |
| `chart-5` | `#5C6BC0` | `#9FA8DA` |
| `chart-6` | `#6A6D70` | `#A9B4BE` |

No gradient `<defs>` in Recharts. Area charts use solid fill at ≤20% opacity of the series color if needed for readability — never a gradient stop.

### Contrast notes (WCAG AA targets)

| Pair | Ratio target |
|------|----------------|
| `text-primary` on `surface` | ≥ 4.5:1 |
| `text-secondary` on `surface` | ≥ 4.5:1 for body; caption may use muted if ≥ 4.5:1 |
| `primary-foreground` on `primary` | ≥ 4.5:1 |
| Large KPI text (`page-title`+) on `surface` | ≥ 3:1 |

---

## 4. Typography

### Families

| Role | Stack |
|------|--------|
| UI | `"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif` |
| Mono (IDs, codes, employee numbers) | `"IBM Plex Mono", ui-monospace, monospace` |

Load via `@fontsource/ibm-plex-sans` and `@fontsource/ibm-plex-mono` (weights 400, 500, 600, 700).

### Weights

| Weight | Use |
|--------|-----|
| 400 | Body, table cells |
| 500 | Labels, buttons, nav items |
| 600 | Section titles, column headers |
| 700 | Page titles, KPI values |

### Type scale (root 14px desktop)

| Role | Size | Line height | Weight | Tailwind reference | Use |
|------|------|-------------|--------|--------------------|-----|
| `display` | 30px / 1.875rem | 36px | 700 | `text-3xl font-bold` | Rare empty-state hero |
| `page-title` | 24px / 1.5rem | 32px | 700 | `text-2xl font-bold` | `PageHeader` title |
| `section-title` | 18px / 1.125rem | 28px | 600 | `text-lg font-semibold` | Tile / card headers |
| `body` | 14px / 0.875rem | 20px | 400 | `text-sm` | Default UI |
| `body-sm` | 13px / 0.8125rem | 18px | 400 | `text-[13px]` | Dense tables |
| `caption` | 12px / 0.75rem | 16px | 400 | `text-xs` | Timestamps, hints |
| `overline` | 11px / 0.6875rem | 16px | 600 | `text-[11px] font-semibold uppercase tracking-wide` | KPI labels, group labels |

### Tabular numbers

Apply `font-variant-numeric: tabular-nums` (Tailwind `tabular-nums`) on currency, counts, percentages, and dates in tables and StatCards.

---

## 5. Spacing, radius, shadow, breakpoints

### Spacing scale (4px base)

| Token | px | rem | Common use |
|-------|----|-----|------------|
| `0` | 0 | 0 | |
| `1` | 4 | 0.25 | Icon gaps |
| `2` | 8 | 0.5 | Compact inline |
| `3` | 12 | 0.75 | Input padding-y |
| `4` | 16 | 1 | Tile gap, page padding tablet |
| `5` | 20 | 1.25 | |
| `6` | 24 | 1.5 | Page padding desktop |
| `8` | 32 | 2 | Section gaps |
| `10` | 40 | 2.5 | Table row height target |
| `12` | 48 | 3 | |
| `16` | 64 | 4 | Large section break |

**No arbitrary spacing in components** — use the scale above.

### Layout constants

| Constant | Value | Token / class |
|----------|-------|----------------|
| Sidebar expanded | 256px | `w-64` |
| Sidebar collapsed | 64px | `w-16` |
| ShellBar height | 52px | `h-[52px]` |
| Content max-width | none (fluid) | — |
| Form page max-width | 672px | `max-w-2xl` |
| Settings content max-width | 896px | `max-w-4xl` |
| Page padding desktop | 24px | `p-6` |
| Page padding tablet | 16px | `p-4` |
| Dashboard tile gap | 16px | `gap-4` |
| Table row height | 40px | `h-10` |

### Radius

| Token | Value | Use |
|-------|-------|-----|
| `radius-sm` | 4px | Badges, chips |
| `radius-md` | 8px | Inputs, buttons |
| `radius-lg` | 8px | Tiles / analytic cards |
| `radius-xl` | 8px | Dialogs (no oversized rounding) |

CSS: `--radius: 0.5rem` (8px). shadcn radius utilities derive from this.

### Shadows

| Token | Use |
|-------|-----|
| none | Tiles, cards, tables, shell at rest |
| `shadow-sm` | Dropdown, popover |
| `shadow-md` | Dialog, sheet (single layer, no colored shadow) |

Never use multi-layer or colored shadows. Never elevate tiles.

### Breakpoints

| Name | Min width | Behavior |
|------|-----------|----------|
| `sm` | 640px | — |
| `md` | 768px | **Minimum supported target (tablet)**; full shell from here |
| `lg` | 1024px | Comfortable two-column detail |
| `xl` | 1280px | Detail main 2/3 + meta 1/3 |
| `2xl` | 1536px | Wide dashboards |

**Responsive rules**

- `≥ md`: ShellBar + SideNavigation + content.
- `< md`: SideNavigation becomes a Sheet; ShellBar shows menu trigger.
- Tables: horizontal scroll; optional sticky first column on HR/CRM lists.
- Desktop-first class ordering preferred.

---

## 6. Layout system

```
┌─────────────────────────────────────────────────────────────┐
│ ShellBar (52px, surface, border-b divider)                  │
├──────────────┬──────────────────────────────────────────────┤
│ SideNav      │ Content canvas (background)                  │
│ 256 / 64     │  ┌────────────────────────────────────────┐  │
│ surface      │  │ PageHeader / tiles / table             │  │
│              │  │ <Outlet />                             │  │
│              │  └────────────────────────────────────────┘  │
└──────────────┴──────────────────────────────────────────────┘
```

### App shell

| Region | Spec |
|--------|------|
| **ShellBar** | Full width, `surface`, `border-b` `divider`, height 52px. Left: product name + current module title. Right: global search, tenant switcher, theme toggle, user menu. |
| **SideNavigation** | Left, `sidebar-bg` / `surface`, **no right border** — canvas contrast separates. Grouped items. Active: `sidebar-active` fill + 3px `sidebar-active-accent` left bar. Collapse to icon-only 64px. Footer: Settings shortcut. |
| **Content canvas** | `background`, scrollable. Dashboard: padded tile grid. Lists: full-bleed table on `surface`. |

React: `AppShell` wraps `<Outlet />`. Sidebar collapsed state in React context + `localStorage` key `emp-sidebar-collapsed`.

### Page templates

#### List page

```
┌─ PageHeader (title, description, primary action) ──────────┐
├─ FilterBar (search, facets, clear) ────────────────────────┤
├─ BulkActionBar (visible when selection > 0) ───────────────┤
├─ DataTable (surface, full width) ──────────────────────────┤
└─ Pagination footer ────────────────────────────────────────┘
```

#### Detail page

```
┌─ PageHeader (back, title, actions) ────────────────────────┐
├─ Tabs (Overview | Related…) ───────────────────────────────┤
├─ Main (2/3 xl) ──────────────┬─ Meta sidebar (1/3 xl) ────┤
│  Sections / forms / activity │  Status, owner, dates      │
└──────────────────────────────┴────────────────────────────┘
```

#### Dashboard

```
┌─ PageHeader (role-aware greeting / title) ─────────────────┐
├─ StatCard grid (auto-fill, gap-4) ─────────────────────────┤
├─ Chart tiles row ──────────────────────────────────────────┤
└─ Recent activity DataTable ────────────────────────────────┘
```

Tiles sit on `surface` with no border frame. Chart tile: title bar (`section-title` + optional actions) then chart body.

#### Form page

```
┌─ PageHeader ───────────────────────────────────────────────┐
│  max-w-2xl (or max-w-4xl settings)                         │
│  Section blocks on surface (no border)                     │
│  Sticky footer: Cancel (ghost) | Save (default)            │
└────────────────────────────────────────────────────────────┘
```

#### Auth layout (no shell)

Centered column on solid `background`. Form on `surface`, no decorative strokes, no gradient backdrop. Logo above form.

#### Marketing landing (public, no shell)

```
┌─ Landing nav (surface, border-b divider): EMP | Sign in | Get started ─┐
├─ Hero (min-h viewport): brand EMP (hero), one headline, one sentence,  ┤
│  CTA group, full-bleed product mock on background canvas               │
├─ Modules section: People | Customers | Work (flat tiles, no borders)   ┤
└─ Footer (divider top): product line + sign-in link                     ┘
```

| Rule | Spec |
|------|------|
| Route | `/` public; authenticated app home is `/app` |
| Brand | “EMP” is the dominant first-viewport signal (larger than headline) |
| Surfaces | Same as product: `background` canvas, `surface` tiles, no gradients, no decorative strokes |
| Motion | Subtle fade/slide on hero copy and mock (respect `prefers-reduced-motion`) |
| CTAs | Primary → `/login`; secondary ghost → `#modules` or `/login` |

---

## 7. Component inventory

### shadcn/ui (initial set)

| Component | EMP usage notes |
|-----------|-----------------|
| Button | `default` / `ghost` / `destructive` / `link` only; avoid `outline` |
| Input | Filled (`bg-surface-hover`), bottom-edge focus `primary` |
| Label | Weight 500, `text-secondary` |
| Textarea | Same as Input |
| Select | Filled trigger |
| Checkbox | Primary checked fill |
| Switch | Primary when on |
| RadioGroup | |
| Dialog | `shadow-md`, `surface-elevated`, no gradient overlay — use solid `black/40` scrim |
| AlertDialog | Destructive confirms |
| Sheet | Mobile nav; filter panel |
| DropdownMenu | `shadow-sm` |
| Popover | `shadow-sm` |
| Command | Global search later |
| Tabs | Detail pages, settings |
| Card | `border-0 shadow-none bg-surface` — tile wrapper |
| Badge | Prefer custom `StatusBadge` for semantics |
| Avatar | Employee / user |
| Separator | Structural `divider` only |
| ScrollArea | Side nav overflow |
| Tooltip | Disabled RoleGate explanations |
| Skeleton | Loading layouts |
| Toast (Sonner) | Success / error |
| Form | react-hook-form + zod |
| Table | Primitive under `DataTable` |
| Calendar | Leave / date filters |
| Breadcrumb | Optional in PageHeader |
| Alert | Inline error / info on pages |

### Custom components

#### `DataTable<T>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef<T>[]` | required | TanStack Table column defs |
| `data` | `T[]` | required | Row data |
| `getRowId` | `(row: T) => string` | required | Stable id |
| `isLoading` | `boolean` | `false` | Shows 5 skeleton rows |
| `isError` | `boolean` | `false` | Error + Retry |
| `error` | `Error \| null` | `null` | Error message |
| `onRetry` | `() => void` | — | Invalidate query |
| `empty` | `EmptyStateProps` | required when empty | EmptyState config |
| `sorting` | `SortingState` | — | Controlled sort |
| `onSortingChange` | … | — | Sync URL params |
| `pagination` | `{ pageIndex, pageSize, pageCount, total }` | — | Server pagination |
| `onPaginationChange` | … | — | |
| `rowSelection` | `RowSelectionState` | — | Bulk select |
| `onRowSelectionChange` | … | — | |
| `onRowClick` | `(row: T) => void` | — | Navigate to detail |
| `enableColumnVisibility` | `boolean` | `false` | |

**States:** default, hover row (`surface-hover`), selected row (`sidebar-active`), loading (skeletons), empty (`EmptyState`), error (Alert + Retry), disabled checkbox cells.

**Variants:** densified (`body-sm`, row `h-10`); optional sticky first column.

#### `KanbanBoard`

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `{ id: string; title: string; wipLimit?: number }[]` | Stages (configurable) |
| `cards` | `{ id: string; columnId: string; title: string; subtitle?: string; value?: string; status?: StatusBadgeVariant }[]` | Deal / work cards |
| `onCardMove` | `(cardId, from, to, index) => void` | Mock drag end |
| `isLoading` | `boolean` | |
| `isError` | `boolean` | |
| `empty` | `EmptyStateProps` | Board-level empty |
| `onCardClick` | `(cardId) => void` | |

**States:** default, dragging (opacity only — no lift shadow glow), column empty placeholder, loading, error. Cards: `surface` flat tiles, no border; column header uses `divider` bottom rule.

#### `StatCard`

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Overline caption |
| `value` | `string \| number` | Large KPI (`page-title` or `display`) |
| `unit` | `string?` | e.g. `%`, `USD` |
| `delta` | `{ value: string; trend: 'up' \| 'down' \| 'flat' }?` | Semantic color only |
| `href` | `string?` | Optional navigate |
| `isLoading` | `boolean?` | Skeleton tile |

**States:** default, hover (if `href`: `surface-hover`), loading. No sparkline gradients. No border.

#### `StatusBadge`

| Prop | Type | Description |
|------|------|-------------|
| `variant` | `'success' \| 'warning' \| 'danger' \| 'info' \| 'neutral'` | Maps to semantic tokens |
| `children` | `ReactNode` | Label |
| `dot` | `boolean` | Optional leading status dot |

**Variants → tokens**

| Variant | Background | Text |
|---------|------------|------|
| success | `success-subtle` | `success` |
| warning | `warning-subtle` | `warning` |
| danger | `danger-subtle` | `danger` |
| info | `info-subtle` | `info` |
| neutral | `surface-hover` | `text-secondary` |

Flat pill, `radius-sm`, no outline.

#### `EmptyState`

| Prop | Type | Description |
|------|------|-------------|
| `icon` | `LucideIcon` | Single muted icon |
| `title` | `string` | |
| `description` | `string?` | |
| `primaryAction` | `{ label: string; onClick: () => void }?` | `Button default` |
| `secondaryAction` | `{ label: string; onClick: () => void }?` | `Button ghost` |

No illustration SVGs.

#### `PageHeader`

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | `page-title` |
| `description` | `string?` | `text-secondary` |
| `breadcrumbs` | `{ label: string; href?: string }[]?` | |
| `actions` | `ReactNode?` | Primary / secondary buttons |
| `backTo` | `string?` | Back link for detail |

#### `FilterBar`

| Prop | Type | Description |
|------|------|-------------|
| `search` | `{ value: string; onChange; placeholder? }` | Debounced 300ms at page level |
| `filters` | `FilterFacet[]` | Selects, date range, etc. |
| `activeCount` | `number` | Chip count |
| `onClearAll` | `() => void` | |
| `collapsed` | `boolean` | Progressive disclosure |
| `onCollapsedChange` | `(v: boolean) => void` | |

#### `CollectionToolbar`

| Prop | Type | Description |
|------|------|-------------|
| `sort` | `{ field: string; direction: 'asc' \| 'desc'; options; onChange }` | Sort dropdown |
| `onRefresh` | `() => void` | Refetch |
| `isRefreshing` | `boolean` | Busy state on refresh |
| `view` | `ViewMode` | Active view id |
| `views` | `ViewMode[]` | Allowed modes for this page |
| `onViewChange` | `(view: ViewMode) => void` | Persist + switch |

#### `EntityCollection<T>` (page helper)

Wraps FilterBar + CollectionToolbar + switches among view renderers (`ListView`/`DataTable`, `GridView`, `TileView`, `KanbanBoard`, `ChartView`, `TimelineView`, `SplitView`, custom stub).

#### `RoleGate`

| Prop | Type | Description |
|------|------|-------------|
| `roles` | `Role[]` | Allowed roles |
| `feature` | `FeatureFlag?` | Optional flag key |
| `mode` | `'hide' \| 'disable'` | Default `hide` |
| `tooltip` | `string?` | Shown when `disable` |
| `fallback` | `ReactNode?` | When `hide` |
| `children` | `ReactNode` | |

### Shared state matrix (apply to all interactive components)

| State | Visual |
|-------|--------|
| default | Token fills as specified |
| hover | `surface-hover` or `primary-hover` |
| focus-visible | 2px solid `ring` (no offset halo) |
| disabled | `disabled` / `disabled-foreground`, `pointer-events-none` |
| loading | Skeleton or button spinner; preserve layout size |
| error | `danger` edge / text; Alert for page-level |

---

## 8. Patterns

### Collection toolbar (filter, sort, refresh, view)

Every collection page (People, Customers, and later Work/Support) uses a shared **`CollectionToolbar`** above the active view.

```
┌─ FilterBar (search + facet filters + clear) ──────────────────────────┐
├─ CollectionToolbar: [Sort] [Refresh] ………… [View switcher] ───────────┤
└─ Active view (list | grid | kanban | tile | chart | timeline | split | custom)
```

| Control | Behavior |
|---------|----------|
| **Filter** | Search (300ms debounce) + optional facet filters; active count + Clear all |
| **Sort** | Dropdown of sort fields + asc/desc; also reflected in list column headers when in list view |
| **Refresh** | Invalidates the page query (`refetch`); button shows brief busy state |
| **View** | Segmented/`DropdownMenu` switcher; persists per route in `localStorage` key `emp-view:{route}` |

#### View modes

| Mode | Id | When to offer | Presentation |
|------|-----|---------------|--------------|
| **List** (default) | `list` | Always | `DataTable` — primary table view |
| **Grid** | `grid` | Directories, contacts | Responsive card grid (identity + key fields) |
| **Tile** | `tile` | KPI-heavy or compact catalogs | Dense equal tiles (label + primary value + meta) |
| **Kanban** | `kanban` | Pipeline, work stages | `KanbanBoard` by status/stage |
| **Chart** | `chart` | Aggregatable metrics | Solid-fill Recharts summary for current filtered set |
| **Timeline** | `timeline` | Date-ordered entities (leave, activity) | Vertical chronological list |
| **Split** | `split` | Master–detail browsing | List pane + detail pane (no route change until “Open”) |
| **Custom** | `custom` | Power users | Saved column/field layout stub (toast / coming-soon until persistence API) |

**Module defaults**

| Page | Allowed views | Default |
|------|---------------|---------|
| Employees | list, grid, tile, split, chart, custom | list |
| Leave | list, timeline, chart, custom | list |
| Attendance | list, tile, chart, custom | list |
| Leads | list, grid, kanban, chart, split, custom | list |
| Contacts | list, grid, tile, split, custom | list |
| Pipeline | kanban, list, chart, custom | kanban |

Surface rules apply to all views: flat `surface` / `background`, no gradients, no decorative card borders.

### Tables

| Concern | Spec |
|---------|------|
| Pagination | Server-driven; default page size **25**; options 10 / 25 / 50 / 100 |
| Sort | Tri-state column headers + toolbar Sort control; `aria-sort`; sync to URL when practical |
| Filters | Debounced search 300ms; facet chips above collection; Clear all |
| Refresh | Toolbar refresh + query Retry on error |
| Bulk actions | Appear when `selectedCount > 0`; destructive → `AlertDialog` |
| Row click | → detail route (list/grid/tile); split uses in-pane preview |
| Loading | 5 skeleton rows / skeleton tiles matching view |
| Empty | Contextual `EmptyState` |
| Error | Destructive `Alert` + Retry → `queryClient.invalidateQueries` |

### Forms

| Concern | Spec |
|---------|------|
| Stack | react-hook-form + zod |
| Errors | Inline under field + summary Alert on submit failure |
| Required | Asterisk on label; `aria-invalid` + `aria-describedby` |
| Inputs | Filled Horizon style; bottom-edge focus / invalid |
| Unsaved changes | Confirm on route leave (`useBlocker` or equivalent) |
| Actions | Sticky footer: Cancel ghost, Submit default; disable submit while pending |

### Empty / loading / error

| State | Pattern |
|-------|---------|
| Route loading | Skeleton layout matching template (list / detail / dashboard) |
| List empty | `EmptyState` with domain copy (e.g. “No leads yet”) + primary CTA |
| Query error | Inline Alert destructive + Retry |
| Partial section error | Section-level Alert; rest of page remains |

Every list view **must** implement all three states.

### Toasts

| Type | Behavior |
|------|----------|
| Success | Sonner, auto-dismiss 4s |
| Error | Sticky until dismiss |
| Undo | Optional action on reversible mutations (mock) |

### Confirmations

- Destructive (delete, reject, deactivate): always `AlertDialog`.
- Non-destructive: toast after success is enough.

---

## 9. Navigation map

### Authenticated shell

| Group | Item | Route | Lucide icon | Notes |
|-------|------|-------|-------------|-------|
| — | Landing (public) | `/` | — | Marketing entry; no shell |
| — | Dashboard | `/app` | `LayoutDashboard` | Role-based widgets |
| People | Employees | `/people/employees` | `Users` | HR core |
| People | Leave | `/people/leave` | `CalendarOff` | |
| People | Attendance | `/people/attendance` | `Clock` | |
| Customers | Leads | `/customers/leads` | `UserPlus` | CRM core |
| Customers | Contacts | `/customers/contacts` | `Contact` | |
| Customers | Pipeline | `/customers/pipeline` | `Kanban` | Configurable stages |
| Work | Projects | `/work/projects` | `FolderKanban` | Phase 2 placeholder |
| Work | Tasks | `/work/tasks` | `CheckSquare` | Phase 2 placeholder |
| Support | Tickets | `/support/tickets` | `LifeBuoy` | Phase 2 placeholder |
| Automation | Workflows | `/automation/workflows` | `Workflow` | Feature-flag gated |
| Documents | Library | `/documents` | `Files` | Phase 2 placeholder |
| Reports | Reports | `/reports` | `BarChart3` | |
| — | Settings | `/settings` | `Settings` | Sub-nav below |

**Settings sub-nav**

| Item | Route |
|------|-------|
| Organization | `/settings/organization` |
| Branding | `/settings/branding` |
| Departments | `/settings/departments` |
| Users & roles | `/settings/users` |

### Auth routes (AuthLayout, no shell)

| Screen | Route |
|--------|-------|
| Login | `/login` |
| Forgot password | `/forgot-password` |
| Reset password | `/reset-password` |
| MFA prompt | `/mfa` |

### Detail route examples

| Entity | Route |
|--------|-------|
| Employee | `/people/employees/:id` |
| Contact / customer | `/customers/contacts/:id` |
| Lead | `/customers/leads/:id` |

Nav items the user cannot access are **hidden** (not disabled) unless partial access requires a disabled control with tooltip via `RoleGate mode="disable"`.

---

## 10. RBAC in the UI

### Roles

```ts
type Role =
  | 'super_admin'
  | 'org_admin'
  | 'dept_manager'
  | 'supervisor'
  | 'employee'
  | 'external';
```

### Feature flags (mock)

```ts
type FeatureFlag =
  | 'crm.enabled'
  | 'hr.leave'
  | 'hr.attendance'
  | 'automation.beta'
  | 'reports.advanced';
```

### Access matrix

Legend: **F** = full, **S** = scoped (dept/team/self), **R** = read-only, **—** = hidden, **A** = admin settings.

| Area | Super Admin | Org Admin | Dept Manager | Supervisor | Employee | External |
|------|-------------|-----------|--------------|------------|----------|----------|
| Tenant switcher | F | — | — | — | — | — |
| Dashboard | F | F | S | S | S | S |
| People / Employees | F | F | S | S (team) | S (self) | — |
| People / Leave | F | F | S | S (team) | S (own) | — |
| People / Attendance | F | F | S | S (team) | S (own) | — |
| Customers / Leads | F | F | R or S* | — | — | S* |
| Customers / Contacts | F | F | R or S* | — | — | S* |
| Customers / Pipeline | F | F | R or S* | — | — | — |
| Work / Projects | F | F | S | S | S (assigned) | — |
| Work / Tasks | F | F | S | S | S (assigned) | — |
| Support / Tickets | F | F | S | S | S (assigned) | S* |
| Automation | F | F | — | — | — | — |
| Documents | F | F | S | S | S | S* |
| Reports | F | F | S | R | — | — |
| Settings / Org | A | A | — | — | — | — |
| Settings / Branding | A | A | — | — | — | — |
| Settings / Departments | A | A | R | — | — | — |
| Settings / Users | A | A | — | — | — | — |

\* Scoped by feature flag and invitation / assignment.

### UI behaviors

1. **`RoleGate`** wraps nav items, page sections, and primary action buttons.
2. **Feature flags:** if `false`, hide nav entry. If role lacks access but flag is on, hide. Optional “Coming soon” badge only when product intentionally shows a disabled module to admins.
3. **Data scope** shown in `PageHeader` description when not org-wide, e.g. `Showing: Engineering department`.
4. **ProtectedRoute:** unauthenticated → `/login`; authenticated but forbidden → `/` with toast or dedicated 403 empty state.
5. Never show dead links. Prefer hide over disable; disable + tooltip when the control must remain visible for layout consistency.

---

## 11. Accessibility rules

Target: **WCAG 2.1 AA**.

| Area | Rule |
|------|------|
| Contrast | Text pairs meet §3 contrast notes |
| Skip link | “Skip to content” as first focusable in shell |
| Keyboard | All actions reachable; SideNavigation roving `tabIndex`; Dialog/Sheet focus trap; Esc closes |
| Focus | `focus-visible`: 2px solid `ring`; never `outline-none` without replacement |
| Tables | `<th scope="col">`; sort controls expose `aria-sort` |
| Forms | Labels associated; errors via `aria-describedby`; `aria-invalid` |
| Live regions | Toasts `aria-live="polite"`; assertive for critical errors if needed |
| Icons | Decorative icons `aria-hidden`; icon-only buttons need `aria-label` |
| Motion | Honor `prefers-reduced-motion`: disable kanban drag animation, shorten transitions to ≤0ms or opacity-only |
| Charts | Provide tabular alternative or summary text for KPI/chart tiles |

---

## 12. Folder structure and naming

### Tree (Step 2 scaffold)

```
src/
  app/
    layouts/           # AppShell, AuthLayout, ShellBar, SideNavigation
    providers/         # ThemeProvider, QueryClientProvider, AuthProvider, TenantProvider
    routes/            # route tree, ProtectedRoute
  components/
    ui/                # shadcn primitives (generated)
    shared/            # PageHeader, EmptyState, DataTable, FilterBar,
                       # StatCard, StatusBadge, KanbanBoard, RoleGate
    domain/
      hr/
      crm/
      settings/
  features/
    auth/
    dashboard/
    people/
    customers/
    settings/
  hooks/               # useTheme, useTenant, useAuth, useFeatureFlags
  lib/                 # cn(), formatters, zod helpers
  mocks/               # fixtures + mock API handlers
  api/                 # React Query keys + queryFns (swap layer for FastAPI)
  types/               # Role, FeatureFlag, entities
  styles/
    globals.css        # CSS variables (light/dark), base
```

### Naming conventions

| Kind | Convention | Example |
|------|------------|---------|
| Component files | PascalCase | `EmployeeListPage.tsx` |
| Hooks | `use` + camelCase | `useEmployeeList.ts` |
| Query key factories | entity + `Keys` | `employeeKeys.list(filters)` |
| Routes | kebab-case paths | `/people/employees` |
| Route components | suffix `Page` | `LeaveRequestsPage` |
| Types | PascalCase | `Employee`, `DealStage` |
| Feature flags | dot.namespace | `crm.enabled` |
| CSS tokens | kebab-case vars | `--surface-hover` |
| Tests (later) | colocated | `DataTable.test.tsx` |

### API / mock swap rule

Components call hooks from `features/*/api` or `hooks` that use React Query. Those hooks call `api/*` query functions. `mocks/*` backs query functions today; replacing with FastAPI clients must not require TSX changes in pages.

Example:

```
EmployeeListPage → useEmployees(filters) → employeeKeys + fetchEmployees
                                              └─ mocks/employees.ts (now)
                                              └─ GET /api/v1/employees (later)
```

---

## Appendix A — Example copy for empty states

| View | Title | Description | Primary CTA |
|------|-------|-------------|-------------|
| Employees | No employees yet | Add people to unlock leave, attendance, and org charts. | Add employee |
| Leave | No leave requests | Requests from your team will show up here. | Request leave |
| Leads | No leads yet | Import or create leads to fill the pipeline. | Create lead |
| Pipeline | Pipeline is empty | Add deals or move leads into stages. | Add deal |
| Users | No users | Invite colleagues and assign roles. | Invite user |

---

## Appendix B — Mock data realism guidelines

- Names: diverse given/family names; no “Test User 1”.
- Departments: Engineering, Sales, People Ops, Finance, Customer Success.
- Deal values: realistic currency amounts with `tabular-nums` (e.g. `$48,000`).
- Dates: ISO in data layer; formatted in UI (`PP` / relative for activity).
- Emails: `firstname.lastname@tenant-domain.example`.

---

## Document control

| Item | Value |
|------|--------|
| Status | Approved — frontend scaffold implemented |
| Stack | React 18, Vite, TypeScript, Tailwind, shadcn/ui, React Query, React Router, Lucide |
| Visual reference | SAP Analytics Cloud / Fiori Horizon (flat, no gradients, no decorative strokes) |
| Default brand | Horizon Blue `#0070F2` / dark `#4DB1FF`, IBM Plex Sans |

**Next (after approval):** Step 2.1 — project scaffold, Tailwind + shadcn driven by these tokens, ThemeProvider (light/dark + tenant brand variables).
