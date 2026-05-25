import { Metadata } from 'next';
import { Suspense } from 'react';
import { DashboardArticlesClient } from '@/components/dashboard/DashboardArticlesClient';
import { PageLoader } from '@/components/ui/loading-spinner';

export const metadata: Metadata = { title: 'Mes articles — Dashboard' };

export default function DashboardArticlesPage() {
  return (
    <div className="animate-fade-in">
      <Suspense fallback={<PageLoader />}>
        <DashboardArticlesClient />
      </Suspense>
    </div>
  );
}
