import { Suspense } from 'react';
import { AdminArticlesTable } from '@/components/admin/AdminArticlesTable';
import { PageLoader } from '@/components/ui/loading-spinner';

export const metadata = { title: 'Articles — Admin' };

export default function AdminArticlesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Articles</h1>
      <Suspense fallback={<PageLoader />}>
        <AdminArticlesTable />
      </Suspense>
    </div>
  );
}
