'use client';

import { useState } from 'react';
import { Eye, FileText, Heart, Users } from 'lucide-react';
import { useAnalyticsOverview } from '@/hooks/useAnalytics';
import { AdminStatCard } from './AdminStatCard';
import { AnalyticsChart } from './AnalyticsChart';
import { formatCount } from '@/lib/utils';

const PERIODS = [
  { value: '7d', label: '7 jours' },
  { value: '30d', label: '30 jours' },
  { value: '90d', label: '90 jours' },
] as const;

export function AnalyticsOverview() {
  const { overview, isLoading } = useAnalyticsOverview();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const stats = [
    { title: 'Articles', value: formatCount(overview?.totalArticles ?? 0), icon: <FileText size={18} /> },
    { title: 'Vues totales', value: formatCount(overview?.totalViews ?? 0), icon: <Eye size={18} /> },
    { title: 'Likes', value: formatCount(overview?.totalLikes ?? 0), icon: <Heart size={18} /> },
    { title: 'Abonnés', value: formatCount(overview?.totalFollowers ?? 0), icon: <Users size={18} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <AdminStatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[var(--text-primary)]">Évolution</h3>
          <div className="flex gap-1 p-1 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${period === p.value ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <AnalyticsChart period={period} height={280} />
      </div>
    </div>
  );
}
