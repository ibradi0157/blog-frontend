'use client';

import { cn } from '@/lib/cn';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

export function AdminStatCard({ title, value, icon, trend, trendLabel, className }: AdminStatCardProps) {
  const trendPositive = trend !== undefined && trend > 0;
  const trendNeutral = trend === 0;

  return (
    <div className={cn('card p-5 space-y-4', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">{title}</p>
          <p className="mt-1.5 text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
            {icon}
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className={cn('flex items-center gap-1.5 text-xs font-medium', trendPositive ? 'text-[var(--success)]' : trendNeutral ? 'text-[var(--text-muted)]' : 'text-[var(--error)]')}>
          {trendPositive ? <TrendingUp size={13} /> : trendNeutral ? <Minus size={13} /> : <TrendingDown size={13} />}
          <span>{trendPositive ? '+' : ''}{trend}% {trendLabel ?? 'vs période précédente'}</span>
        </div>
      )}
    </div>
  );
}
