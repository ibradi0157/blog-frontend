import { Suspense } from 'react';
import { Metadata } from 'next';
import { SearchPageClient } from './SearchPageClient';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PageLoader } from '@/components/ui/loading-spinner';

export function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Metadata {
  const q = searchParams.q;
  return {
    title: q ? `Résultats pour « ${q} » — Blog` : 'Recherche — Blog',
  };
}

export default function RecherchePage() {
  return (
    <PageWrapper>
      <div className="py-8">
        <Suspense fallback={<PageLoader />}>
          <SearchPageClient />
        </Suspense>
      </div>
    </PageWrapper>
  );
}