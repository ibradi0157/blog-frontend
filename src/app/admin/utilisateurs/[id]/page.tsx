import { Suspense } from 'react';
import { PageLoader } from '@/components/ui/loading-spinner';

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `Utilisateur ${id} — Admin` };
}

export default async function AdminUserDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="space-y-6 animate-fade-in">
      <Suspense fallback={<PageLoader />}>
        <AdminUserDetailClient userId={id} />
      </Suspense>
    </div>
  );
}

// Client component inline pour éviter les imports cassés
import dynamic from 'next/dynamic';
const AdminUserDetailClient = dynamic(
  () => import('@/components/admin/AdminUserDetailClient').then(m => m.AdminUserDetailClient),
  { loading: () => <PageLoader />, ssr: false }
);
