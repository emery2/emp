import { FileQuestion } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-start gap-4 py-16">
      <FileQuestion className="h-10 w-10 text-text-muted" strokeWidth={1.5} />
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Page not found</h1>
        <p className="mt-2 text-sm text-text-secondary">
          The page you requested does not exist or has moved.
        </p>
      </div>
      <Button asChild>
        <Link to="/app">Back to dashboard</Link>
      </Button>
    </div>
  )
}
