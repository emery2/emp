import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

export interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: { label: string; href?: string }[]
  actions?: React.ReactNode
  backTo?: string
  className?: string
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  backTo,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6 flex flex-col gap-3', className)}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav aria-label="Breadcrumb" className="text-xs text-text-muted">
          <ol className="flex flex-wrap items-center gap-1">
            {breadcrumbs.map((crumb, index) => (
              <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
                {index > 0 ? <span aria-hidden>/</span> : null}
                {crumb.href ? (
                  <Link to={crumb.href} className="hover:text-primary">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-text-secondary">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-1">
          {backTo ? (
            <Link
              to={backTo}
              className="mb-1 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Back
            </Link>
          ) : null}
          <h1 className="text-2xl font-bold leading-8 text-text-primary">
            {title}
          </h1>
          {description ? (
            <p className="text-sm text-text-secondary">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  )
}
