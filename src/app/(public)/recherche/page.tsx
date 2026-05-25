import { Suspense } from 'react';
import { Metadata } from 'next';
import { SearchPageClient } from '@/components/search/SearchPageClient';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PageLoader } from '@/components/ui/loading-spinner';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q;
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