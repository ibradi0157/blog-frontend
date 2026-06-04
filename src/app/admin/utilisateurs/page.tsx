import Link from 'next/link';
import { Suspense } from 'react';
import { UsersTable } from '@/components/admin/UsersTable';
import { PageLoader } from '@/components/ui/loading-spinner';
import { ROUTES } from '@/lib/constants';

export const metadata = { title: 'Utilisateurs — Admin' };

export default function AdminUsersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Utilisateurs</h1>
        <Link href={ROUTES.ADMIN_NEW_USER} className="btn-primary text-sm shrink-0">
          Nouveau membre
        </Link>
      </div>
      <Suspense fallback={<PageLoader />}>
        <UsersTable />
      </Suspense>
    </div>
  );
}
