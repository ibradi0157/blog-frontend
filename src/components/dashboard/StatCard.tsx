'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  const isPositive = trend && trend.value >= 0;

  return (
    <div className={cn('card p-6 flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--text-secondary)]">{title}</span>
        <span className="p-2 rounded-lg bg-[var(--accent-muted)] text-[var(--accent)]">
          {icon}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-[var(--text-primary)]">{value}</span>
        {trend && (
          <span
            className={cn(
              'text-xs font-medium px-2 py-1 rounded-full',
              isPositive
                ? 'bg-green-500/10 text-[var(--success)]'
                : 'bg-red-500/10 text-[var(--error)]'
            )}
          >
            {isPositive ? '+' : ''}
            {trend.value}% {trend.label}
          </span>
        )}
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-[var(--bg-hover)]" />
        <div className="h-8 w-8 rounded-lg bg-[var(--bg-hover)]" />
      </div>
      <div className="flex items-end justify-between">
        <div className="h-8 w-20 rounded bg-[var(--bg-hover)]" />
        <div className="h-5 w-16 rounded-full bg-[var(--bg-hover)]" />
      </div>
    </div>
  );
}