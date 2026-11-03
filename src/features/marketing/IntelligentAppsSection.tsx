import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  intelligentAppCategories,
  type IntelligentAppCategory,
} from '@/features/marketing/content'
import { cn } from '@/lib/cn'

function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 1.2 13.9 9.1 21.8 11 13.9 12.9 12 20.8 10.1 12.9 2.2 11l7.9-1.9L12 1.2Z" />
    </svg>
  )
}

function HexIcon({
  color,
  filled,
}: {
  color: string
  filled?: boolean
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      aria-hidden
    >
      <path
        d="M12 2.2 20.2 7v10L12 21.8 3.8 17V7L12 2.2Z"
        fill={filled ? color : 'transparent'}
        stroke={color}
        strokeWidth="1.6"
      />
    </svg>
  )
}

function HexCell({
  x,
  y,
  size,
  label,
  active,
}: {
  x: number
  y: number
  size: number
  label?: string
  active?: boolean
}) {
  const w = size
  const h = size * 1.1547
  const points = [
    [w * 0.5, 0],
    [w, h * 0.25],
    [w, h * 0.75],
    [w * 0.5, h],
    [0, h * 0.75],
    [0, h * 0.25],
  ]
    .map(([px, py]) => `${px},${py}`)
    .join(' ')

  return (
    <g transform={`translate(${x} ${y})`}>
      {active ? (
        <defs>
          <linearGradient
            id={`hex-glow-${label?.replace(/\s+/g, '-') ?? 'x'}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ff8a3d" />
            <stop offset="55%" stopColor="#ff6a00" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          <filter
            id={`hex-blur-${label?.replace(/\s+/g, '-') ?? 'x'}`}
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      ) : null}
      <polygon
        points={points}
        fill={active ? 'rgba(255,106,0,0.08)' : 'transparent'}
        stroke={
          active
            ? `url(#hex-glow-${label?.replace(/\s+/g, '-') ?? 'x'})`
            : 'rgba(140,170,210,0.28)'
        }
        strokeWidth={active ? 2.4 : 1}
        filter={
          active
            ? `url(#hex-blur-${label?.replace(/\s+/g, '-') ?? 'x'})`
            : undefined
        }
      />
      {label ? (
        <foreignObject x={w * 0.12} y={h * 0.28} width={w * 0.76} height={h * 0.44}>
          <div className="flex h-full items-center justify-center px-1 text-center text-[0.7rem] font-semibold leading-tight text-white md:text-[0.8rem]">
            {label}
          </div>
        </foreignObject>
      ) : null}
    </g>
  )
}

function HexGrid({ category }: { category: IntelligentAppCategory }) {
  const size = 118
  const h = size * 1.1547
  const colGap = size * 0.78
  const rowGap = h * 0.76

  const cells = useMemo(() => {
    const rows = 6
    const cols = 7
    const items: Array<{
      key: string
      x: number
      y: number
      label?: string
      active?: boolean
    }> = []

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const offset = row % 2 === 0 ? 0 : colGap * 0.5
        items.push({
          key: `${row}-${col}`,
          x: col * colGap + offset,
          y: row * rowGap,
        })
      }
    }

    // Highlight three stacked hexes roughly center-right
    const highlights = [
      { row: 1, col: 4, label: category.apps[0] },
      { row: 2, col: 4, label: category.apps[1] },
      { row: 3, col: 4, label: category.apps[2] },
    ]

    for (const spot of highlights) {
      const cell = items.find((item) => item.key === `${spot.row}-${spot.col}`)
      if (cell && spot.label) {
        cell.active = true
        cell.label = spot.label
      }
    }

    return items
  }, [category.apps, colGap, rowGap])

  const width = colGap * 7 + size * 0.5
  const height = rowGap * 6 + h * 0.25

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full overflow-visible"
      role="img"
      aria-label={`${category.label} applications`}
    >
      {cells.map((cell) => (
        <HexCell
          key={cell.key}
          x={cell.x}
          y={cell.y}
          size={size}
          label={cell.label}
          active={cell.active}
        />
      ))}
    </svg>
  )
}

export function IntelligentAppsSection() {
  const [activeId, setActiveId] = useState(intelligentAppCategories[3]?.id ?? 'hr')
  const active =
    intelligentAppCategories.find((category) => category.id === activeId) ??
    intelligentAppCategories[0]

  return (
    <section className="relative overflow-hidden bg-[#00162b] text-white">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[55%] bg-[radial-gradient(ellipse_at_right,_rgba(120,150,220,0.22)_0%,_transparent_60%)]"
        aria-hidden
      />
      <Sparkle className="pointer-events-none absolute left-[46%] top-16 h-4 w-4 text-[#ff6a00]" />
      <Sparkle className="pointer-events-none absolute left-[52%] top-24 h-3 w-3 text-[#a8b8ff]" />

      <div className="marketing-container grid items-center gap-10 py-16 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8 lg:py-20">
        <div className="relative z-10 max-w-xl">
          <h2 className="text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-[3.25rem]">
            Accelerate decisions with{' '}
            <span className="text-[var(--marketing-accent)]">
              intelligent applications
            </span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-white/80 md:text-lg md:leading-8">
            Pre-built EMP applications for the functions that run your business—
            on one shared core, with hierarchy-aware permissions.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex h-12 items-center rounded-full border border-white/80 px-6 text-sm font-bold text-white hover:bg-white/10"
          >
            Explore EMP Applications
          </Link>

          <ul className="mt-10 space-y-1" role="listbox" aria-label="Application categories">
            {intelligentAppCategories.map((category) => {
              const selected = category.id === active.id
              return (
                <li key={category.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => setActiveId(category.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base transition-colors',
                      selected
                        ? 'font-bold text-white'
                        : 'font-medium text-white/75 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    <HexIcon color={category.color} filled={selected} />
                    {category.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="relative z-10 min-h-[26rem] md:min-h-[32rem] lg:min-h-[36rem]">
          <div className="absolute inset-0 motion-safe:transition-opacity motion-safe:duration-300">
            <HexGrid key={active.id} category={active} />
          </div>
        </div>
      </div>
    </section>
  )
}
