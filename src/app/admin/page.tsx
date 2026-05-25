import { Suspense } from 'react';
import { AnalyticsOverview } from '@/components/admin/AnalyticsOverview';
import { PageLoader } from '@/components/ui/loading-spinner';

export const metadata = { title: 'Dashboard Admin' };

export default function AdminPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Tableau de bord admin</h1>
      <Suspense fallback={<PageLoader />}>
        <AnalyticsOverview />
      </Suspense>
    </div>
  );
}
