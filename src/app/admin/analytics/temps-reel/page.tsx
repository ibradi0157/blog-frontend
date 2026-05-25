'use client';
import { useRealTimeStats } from '@/hooks/useAnalytics';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { Eye, Users, Activity } from 'lucide-react';

export default function AdminRealTimePage() {
  const { realTime, isLoading } = useRealTimeStats();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Statistiques temps réel</h1>
        <span className="flex items-center gap-1.5 text-xs text-[var(--success)] bg-[var(--success)]/10 px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
          Live
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard title="Visiteurs actifs" value={(realTime as any)?.activeUsers ?? '—'} icon={<Users size={18} />} />
        <AdminStatCard title="Vues (dernière heure)" value={(realTime as any)?.viewsLastHour ?? '—'} icon={<Eye size={18} />} />
        <AdminStatCard title="Événements/min" value={(realTime as any)?.eventsPerMinute ?? '—'} icon={<Activity size={18} />} />
      </div>
    </div>
  );
}
