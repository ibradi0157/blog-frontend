import { Suspense } from 'react';
import { PageLoader } from '@/components/ui/loading-spinner';
import { RoleGuard } from '@/components/auth/RoleGuard';

interface Props { params: Promise<{ id: string }> }

export default async function AdminUserDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <RoleGuard roles={['PRIMARY_ADMIN', 'SECONDARY_ADMIN']}>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Détail utilisateur</h1>
        <p className="text-[var(--text-muted)]">ID : {id}</p>
      </div>
    </RoleGuard>
  );
}
