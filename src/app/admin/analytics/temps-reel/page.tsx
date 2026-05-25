import { Metadata } from 'next';
import { Suspense } from 'react';
import { AdminRealTimeClient } from '@/components/admin/AdminRealTimeClient';
import { PageLoader } from '@/components/ui/loading-spinner';

export const metadata: Metadata = { title: 'Temps réel — Analytics Admin' };

export default function AdminRealTimePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Statistiques temps réel</h1>
        <span className="flex items-center gap-1.5 text-xs text-[var(--success)] bg-[var(--success)]/10 px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
          Live
        </span>
      </div>
      <Suspense fallback={<PageLoader />}>
        <AdminRealTimeClient />
      </Suspense>
    </div>
  );
}
