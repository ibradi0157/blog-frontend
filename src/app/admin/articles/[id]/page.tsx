import { Suspense } from 'react';
import { PageLoader } from '@/components/ui/loading-spinner';
import dynamic from 'next/dynamic';

const AdminArticleDetailClient = dynamic(
  () => import('@/components/admin/AdminArticleDetailClient').then(m => m.AdminArticleDetailClient),
  { loading: () => <PageLoader />, ssr: false }
);

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `Article ${id} — Admin` };
}

export default async function AdminArticleDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="space-y-6 animate-fade-in">
      <Suspense fallback={<PageLoader />}>
        <AdminArticleDetailClient articleId={id} />
      </Suspense>
    </div>
  );
}
