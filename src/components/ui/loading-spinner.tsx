import { cn } from '@/lib/cn'

interface LoadingSpinnerProps {
  size?:      'sm' | 'md' | 'lg'
  className?: string
  label?:     string
}

const sizes = {
  sm: 'w-4 h-4 border-[1.5px]',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-2',
}

export function LoadingSpinner({ size = 'md', className, label }: LoadingSpinnerProps) {
  return (
    <span role="status" aria-label={label ?? 'Chargement'} className={cn('inline-flex flex-col items-center gap-2', className)}>
      <span
        className={cn(
          'rounded-full border-[var(--border)] border-t-[var(--accent)]',
          sizes[size],
        )}
        style={{ animation: 'spin .7s linear infinite' }}
      />
      {label && (
        <span className="text-xs text-[var(--text-muted)]">{label}</span>
      )}
    </span>
  )
}

export function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[30vh]">
      <LoadingSpinner size="lg" label="Chargement…" />
    </div>
  )
}
