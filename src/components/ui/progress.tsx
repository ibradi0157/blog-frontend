import { cn } from '@/lib/cn';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  showLabel?: boolean;
}

export function Progress({ value = 0, max = 100, showLabel, className, ...props }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn('flex items-center gap-3 w-full', className)} {...props}>
      <div className="flex-1 h-2 rounded-full bg-[var(--bg-hover)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <span className="text-xs text-[var(--text-muted)] shrink-0 w-9 text-right">{Math.round(pct)}%</span>}
    </div>
  );
}
