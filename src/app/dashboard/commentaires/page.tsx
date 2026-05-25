import { Metadata } from 'next';
import { Suspense } from 'react';
import { DashboardCommentsClient } from '@/components/dashboard/DashboardCommentsClient';
import { PageLoader } from '@/components/ui/loading-spinner';

export const metadata: Metadata = { title: 'Mes commentaires — Dashboard' };

export default function DashboardCommentsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Mes commentaires</h1>
      <Suspense fallback={<PageLoader />}>
        <DashboardCommentsClient />
      </Suspense>
    </div>
  );
}
