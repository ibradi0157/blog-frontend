import { Metadata } from 'next';
import { Suspense } from 'react';
import { DashboardFollowersClient } from '@/components/dashboard/DashboardFollowersClient';
import { PageLoader } from '@/components/ui/loading-spinner';

export const metadata: Metadata = { title: 'Abonnés — Dashboard' };

export default function DashboardFollowersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Abonnés</h1>
      <Suspense fallback={<PageLoader />}>
        <DashboardFollowersClient />
      </Suspense>
    </div>
  );
}
