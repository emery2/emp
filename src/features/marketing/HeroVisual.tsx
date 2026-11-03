function Sparkle({
  className,
  color,
}: {
  className?: string
  color: string
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden
    >
      <path d="M12 1.5 13.8 9.2 21.5 11 13.8 12.8 12 20.5 10.2 12.8 2.5 11l7.7-1.8L12 1.5Z" />
    </svg>
  )
}

export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-[5/4] h-full w-full min-h-[26rem] max-w-none md:min-h-[32rem]">
      <Sparkle
        className="absolute right-[18%] top-[12%] h-3.5 w-3.5"
        color="#7b61ff"
      />
      <Sparkle
        className="absolute bottom-[18%] left-[2%] h-3 w-3"
        color="#3d7eff"
      />

      {/* Workflow floater */}
      <div className="absolute left-[4%] top-[10%] z-20 w-[9.5rem] rounded-xl border border-white/70 bg-white/95 p-3 shadow-[0_12px_30px_rgba(13,32,51,0.16)]">
        <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-[#7a8494]">
          Approval
        </p>
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
            <span className="text-[0.7rem] font-semibold text-[var(--marketing-ink)]">
              Line approver
            </span>
          </div>
          <div className="ml-1 h-3 w-px bg-[#d5dbe5]" />
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#3d7eff]" />
            <span className="text-[0.7rem] font-semibold text-[var(--marketing-ink)]">
              HR verify
            </span>
          </div>
        </div>
      </div>

      {/* KPI floater */}
      <div className="absolute bottom-[22%] left-0 z-20 w-[10.5rem] rounded-xl border border-white/70 bg-white p-3 shadow-[0_12px_30px_rgba(13,32,51,0.16)]">
        <p className="text-[0.65rem] font-semibold text-[#7a8494]">
          Open pipeline
        </p>
        <p className="mt-1 text-lg font-bold text-[var(--marketing-ink)]">
          1.24M
        </p>
        <div className="mt-2 flex h-8 items-end gap-1">
          {[40, 55, 35, 70, 48, 82, 60].map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-sm bg-[#3d7eff]/80"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Main dashboard */}
      <div className="absolute inset-[8%_8%_6%_10%] z-10 overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_24px_60px_rgba(13,32,51,0.22)]">
        <div className="flex items-center justify-between border-b border-[#eef0f4] px-4 py-3">
          <p className="text-sm font-bold text-[var(--marketing-ink)]">
            Workforce Planning
          </p>
          <span className="rounded-full bg-[#eef5ff] px-2 py-0.5 text-[0.65rem] font-semibold text-[#2d4a8c]">
            Live
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 px-4 py-3">
          {[
            { label: 'On leave', value: '18', tone: 'text-[#16a34a]' },
            { label: 'Coverage', value: '94%', tone: 'text-[#16a34a]' },
            { label: 'At risk', value: '3', tone: 'text-[#dc2626]' },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-lg border border-[#eef0f4] bg-[#fafbfd] px-2 py-2"
            >
              <p className="text-[0.6rem] font-medium text-[#7a8494]">
                {kpi.label}
              </p>
              <p className={`mt-0.5 text-sm font-bold ${kpi.tone}`}>
                {kpi.value}
              </p>
            </div>
          ))}
        </div>
        <div className="px-4 pb-3">
          <div className="relative h-28 overflow-hidden rounded-xl bg-[#f4f7fc]">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 320 120"
              fill="none"
              aria-hidden
            >
              <path
                d="M20 90 C60 88, 80 40, 120 48 C160 56, 180 20, 220 30 C260 40, 280 70, 300 55"
                stroke="#3d7eff"
                strokeWidth="2.5"
                fill="none"
              />
              <circle cx="120" cy="48" r="5" fill="#fff" stroke="#3d7eff" strokeWidth="2" />
              <circle cx="220" cy="30" r="5" fill="#fff" stroke="#ff6a00" strokeWidth="2" />
              <circle cx="300" cy="55" r="5" fill="#fff" stroke="#7b61ff" strokeWidth="2" />
              <text x="108" y="70" fill="#5c6777" fontSize="8" fontFamily="sans-serif">
                Headcount
              </text>
              <text x="200" y="20" fill="#5c6777" fontSize="8" fontFamily="sans-serif">
                Demand
              </text>
            </svg>
          </div>
          <div className="mt-3 flex h-12 items-end gap-1.5">
            {[35, 48, 42, 60, 55, 72, 68, 80, 74, 88].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-t-sm bg-[#c9d7f2]"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Chat panel */}
      <div className="absolute bottom-[8%] right-0 z-30 w-[11.5rem] overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_18px_40px_rgba(13,32,51,0.2)] md:w-[12.5rem]">
        <div className="flex items-center gap-2 border-b border-[#eef0f4] px-3 py-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--marketing-navy)] text-[0.65rem] font-bold text-white">
            E
          </span>
          <p className="text-xs font-bold text-[var(--marketing-ink)]">EMP Assist</p>
        </div>
        <div className="space-y-2 p-3">
          <div className="rounded-xl rounded-tl-sm bg-[#eef2f8] px-2.5 py-2 text-[0.7rem] leading-4 text-[var(--marketing-ink)]">
            Who is out next week in Sales, and can we still cover open deals?
          </div>
          <div className="rounded-xl rounded-tr-sm bg-[#3d7eff] px-2.5 py-2 text-[0.7rem] leading-4 text-white">
            4 on leave. Coverage 91%. Two deals need reassignment.
          </div>
        </div>
      </div>
    </div>
  )
}
