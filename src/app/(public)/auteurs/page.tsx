import { Suspense } from 'react';
import { Metadata } from 'next';
import { AuthorsPageClient } from '../../../components/Authors/AuthorsPageClient';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PageLoader } from '@/components/ui/loading-spinner';

export const metadata: Metadata = {
  title: 'Auteurs — Blog',
  description: 'Découvrez les auteurs qui partagent leurs connaissances sur notre plateforme.',
};

export default function AuthorsPage() {
  return (
    <PageWrapper>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Nos auteurs</h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Découvrez les contributeurs qui enrichissent notre communauté.
        </p>
        <Suspense fallback={<PageLoader />}>
          <AuthorsPageClient />
        </Suspense>
      </div>
    </PageWrapper>
  );
}