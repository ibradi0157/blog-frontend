import { Suspense } from 'react';
import { UsersTable } from '@/components/admin/UsersTable';
import { PageLoader } from '@/components/ui/loading-spinner';

export const metadata = { title: 'Utilisateurs — Admin' };

export default function AdminUsersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Utilisateurs</h1>
      <Suspense fallback={<PageLoader />}>
        <UsersTable />
      </Suspense>
    </div>
  );
}
