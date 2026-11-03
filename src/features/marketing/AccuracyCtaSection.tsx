import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

function Sparkle({
  className,
  color,
}: {
  className?: string
  color: string
}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d="M12 1.2 13.9 9.1 21.8 11 13.9 12.9 12 20.8 10.1 12.9 2.2 11l7.9-1.9L12 1.2Z" />
    </svg>
  )
}

function CtaVisual() {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[38rem] lg:max-w-none">
      <Sparkle className="absolute left-[6%] top-[8%] h-4 w-4" color="#ff6a00" />
      <Sparkle className="absolute right-[12%] top-[4%] h-3.5 w-3.5" color="#5b6cff" />

      <div className="absolute left-[2%] top-[28%] z-20 flex h-28 w-28 flex-col items-center justify-center rounded-full border border-white/80 bg-white shadow-[0_16px_40px_rgba(13,32,51,0.18)]">
        <svg viewBox="0 0 36 36" className="h-14 w-14" aria-hidden>
          <circle cx="18" cy="18" r="14" fill="none" stroke="#e8edf5" strokeWidth="4" />
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="#2d4a8c"
            strokeWidth="4"
            strokeDasharray="55 88"
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
          />
        </svg>
        <p className="mt-1 text-[0.65rem] font-semibold text-[var(--marketing-ink)]">
          Resource Capacity
        </p>
      </div>

      <div className="absolute right-[8%] top-[6%] z-30 flex max-w-[14rem] items-start gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2d4a8c] text-xs font-bold text-white">
          HF
        </div>
        <div className="rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-xs font-medium leading-4 text-[var(--marketing-ink)] shadow-md">
          What happens if we shift headcount to mid-market?
        </div>
      </div>

      <div className="absolute inset-[10%_0_4%_12%] z-10 overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_24px_60px_rgba(13,32,51,0.2)]">
        <div className="grid h-full grid-cols-[1.4fr_0.9fr]">
          <div className="border-r border-[#eef0f4] p-4">
            <p className="text-sm font-bold text-[var(--marketing-ink)]">
              Scenario planning
            </p>
            <div className="mt-3 h-20 rounded-xl bg-[#f4f7fc]">
              <svg viewBox="0 0 240 80" className="h-full w-full" aria-hidden>
                <path
                  d="M10 55 C40 52, 55 30, 85 34 C115 38, 130 18, 160 22 C190 26, 205 40, 230 28"
                  fill="none"
                  stroke="#2d4a8c"
                  strokeWidth="2.5"
                />
                <path
                  d="M10 62 C45 60, 70 48, 100 50 C140 52, 170 44, 230 46 L230 72 L10 72 Z"
                  fill="rgba(45,74,140,0.12)"
                />
              </svg>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                ['Headcount', '128'],
                ['Coverage', '94%'],
                ['Open roles', '6'],
                ['Risk', 'Low'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-[#eef0f4] bg-[#fafbfd] px-2.5 py-2"
                >
                  <p className="text-[0.65rem] text-[#7a8494]">{label}</p>
                  <p className="text-sm font-bold text-[var(--marketing-ink)]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#f7f9fc] p-3">
            <p className="text-xs font-bold text-[var(--marketing-ink)]">EMP Assist</p>
            <div className="mt-3 space-y-2">
              <div className="rounded-xl bg-white px-2.5 py-2 text-[0.7rem] leading-4 text-[var(--marketing-ink)] shadow-sm">
                Mid-market shift frees 4 FTE in enterprise coverage next quarter.
              </div>
              <ul className="space-y-1.5 rounded-xl bg-white px-2.5 py-2 text-[0.7rem] text-[#5c6777] shadow-sm">
                <li>• Reassign 2 AEs</li>
                <li>• Hold hiring in West</li>
                <li>• Keep SLA ≥ 91%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AccuracyCtaSection() {
  const { isAuthenticated } = useAuth()
  const demoTo = isAuthenticated ? '/app' : '/login'

  return (
    <section
      className="relative overflow-hidden border-b border-[#e6e8ec]"
      style={{
        background:
          'linear-gradient(110deg, #f7ebe3 0%, #f3e8ef 28%, #e4e8f7 62%, #c9d0ef 100%)',
      }}
    >
      <div className="marketing-container grid items-center gap-10 py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 lg:py-20">
        <div className="relative z-10 max-w-xl">
          <div className="flex flex-wrap items-center gap-5 text-sm text-[var(--marketing-ink)]">
            <div className="flex items-center gap-2">
              <span className="rounded bg-white/70 px-2 py-1 text-xs font-bold tracking-wide">
                Peer Insights
              </span>
              <span className="font-semibold">4.5/5</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-white/70 px-2 py-1 text-xs font-bold tracking-wide">
                G2
              </span>
              <span className="font-semibold">4.6/5</span>
            </div>
          </div>

          <h2 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-[var(--marketing-ink)] md:text-5xl lg:text-[3.35rem]">
            100% accuracy is a non-negotiable
          </h2>
          <p className="mt-5 text-base leading-7 text-[#243447] md:text-lg md:leading-8">
            Find out how you can turn siloed systems into a scalable,
            hierarchy-aware operating suite—people, customers, and work on one
            core.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={demoTo}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--marketing-navy)] px-6 text-sm font-bold text-white hover:opacity-90"
            >
              Request a demo
              <span aria-hidden>→</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex h-12 items-center rounded-full border border-[var(--marketing-navy)] px-6 text-sm font-bold text-[var(--marketing-navy)] hover:bg-white/50"
            >
              Contact us
            </Link>
          </div>
        </div>

        <div className="relative z-10 min-h-[24rem] md:min-h-[30rem]">
          <CtaVisual />
        </div>
      </div>
    </section>
  )
}
