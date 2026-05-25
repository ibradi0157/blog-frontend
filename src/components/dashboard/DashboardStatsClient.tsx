'use client';

import { Eye, FileText, Heart, Users } from 'lucide-react';
import { StatCard } from './StatCard';
import { useAnalyticsOverview } from '@/hooks/useAnalytics';
import { formatCount } from '@/lib/utils';

function StatCardSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="h-3 bg-[var(--bg-hover)] rounded w-24 mb-2" />
          <div className="h-7 bg-[var(--bg-hover)] rounded w-16" />
        </div>
        <div className="w-10 h-10 bg-[var(--bg-hover)] rounded-xl" />
      </div>
    </div>
  );
}

export function DashboardStatsClient() {
  const { overview, isLoading } = useAnalyticsOverview();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    );
  }

  const stats = [
    {
      title: 'Articles publiés',
      value: formatCount(overview?.totalArticles ?? 0),
      icon: <FileText size={18} />,
    },
    {
      title: 'Vues totales',
      value: formatCount(overview?.totalViews ?? 0),
      icon: <Eye size={18} />,
    },
    {
      title: 'Likes reçus',
      value: formatCount(overview?.totalLikes ?? 0),
      icon: <Heart size={18} />,
    },
    {
      title: 'Abonnés',
      value: formatCount(overview?.totalFollowers ?? 0),
      icon: <Users size={18} />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <StatCard key={s.title} {...s} />
      ))}
    </div>
  );
}
