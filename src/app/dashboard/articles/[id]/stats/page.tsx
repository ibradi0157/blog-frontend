import { Metadata } from 'next';
import { Suspense } from 'react';
import { PageLoader } from '@/components/ui/loading-spinner';
import { ArticleStatsClient } from '@/components/dashboard/ArticleStatsClient';

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Stats article ${id} — Dashboard` };
}

export default async function ArticleStatsPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Statistiques de l'article</h1>
      <Suspense fallback={<PageLoader />}>
        <ArticleStatsClient articleId={id} />
      </Suspense>
    </div>
  );
}
