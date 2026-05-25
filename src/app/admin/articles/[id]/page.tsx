import { Suspense } from 'react';
import { PageLoader } from '@/components/ui/loading-spinner';

interface Props { params: Promise<{ id: string }> }

export default async function AdminArticleDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Article #{id}</h1>
      <Suspense fallback={<PageLoader />}>
        <p className="text-[var(--text-muted)]">Vue admin de l'article (modération, stats, édition).</p>
      </Suspense>
    </div>
  );
}
