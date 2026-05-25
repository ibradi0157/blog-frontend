import { Suspense } from 'react';
import { ReportsTable } from '@/components/admin/ReportsTable';
import { PageLoader } from '@/components/ui/loading-spinner';

export const metadata = { title: 'Signalements — Admin' };

export default function AdminReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Signalements</h1>
      <Suspense fallback={<PageLoader />}>
        <ReportsTable />
      </Suspense>
    </div>
  );
}
