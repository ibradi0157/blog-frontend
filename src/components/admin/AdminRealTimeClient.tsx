'use client';

import { useRealTimeStats } from '@/hooks/useAnalytics';
import { AdminStatCard } from './AdminStatCard';
import { Eye, Users, Activity } from 'lucide-react';

export function AdminRealTimeClient() {
  const { realTime, isLoading } = useRealTimeStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 bg-[var(--bg-hover)] rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <AdminStatCard title="Visiteurs actifs"       value={(realTime as any)?.activeUsers     ?? '—'} icon={<Users    size={18} />} />
      <AdminStatCard title="Vues (dernière heure)"  value={(realTime as any)?.viewsLastHour   ?? '—'} icon={<Eye      size={18} />} />
      <AdminStatCard title="Événements/min"         value={(realTime as any)?.eventsPerMinute ?? '—'} icon={<Activity size={18} />} />
    </div>
  );
}
