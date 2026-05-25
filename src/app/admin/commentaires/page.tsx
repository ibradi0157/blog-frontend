import { Suspense } from 'react';
import { CommentsTable } from '@/components/admin/CommentsTable';
import { PageLoader } from '@/components/ui/loading-spinner';

export const metadata = { title: 'Commentaires — Admin' };

export default function AdminCommentsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Commentaires</h1>
      <Suspense fallback={<PageLoader />}>
        <CommentsTable />
      </Suspense>
    </div>
  );
}
