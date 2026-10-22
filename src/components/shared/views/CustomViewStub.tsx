import { Sparkles } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'

export function CustomViewStub({ onConfigure }: { onConfigure?: () => void }) {
  return (
    <div className="bg-surface">
      <EmptyState
        icon={Sparkles}
        title="Custom view"
        description="Save column layouts and field presets per user. Configuration will persist when the API is connected."
        primaryAction={
          onConfigure
            ? { label: 'Configure layout', onClick: onConfigure }
            : undefined
        }
      />
    </div>
  )
}
