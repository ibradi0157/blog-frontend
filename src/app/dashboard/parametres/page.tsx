import { Metadata } from 'next';
import { Suspense } from 'react';
import { DashboardSettingsClient } from '@/components/dashboard/DashboardSettingsClient';
import { PageLoader } from '@/components/ui/loading-spinner';

export const metadata: Metadata = { title: 'Paramètres — Dashboard' };

export default function DashboardSettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Paramètres du compte</h1>
      <Suspense fallback={<PageLoader />}>
        <DashboardSettingsClient />
      </Suspense>
    </div>
  );
}
