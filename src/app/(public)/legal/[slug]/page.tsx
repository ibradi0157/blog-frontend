import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { apiClient } from '@/lib/api-client';
import { LegalPageSlug } from '@/types/api';
import { formatDate } from '@/lib/utils';

interface LegalPageProps {
  params: { slug: LegalPageSlug };
}

const TITLES: Record<string, string> = {
  'privacy-policy': 'Politique de confidentialité',
  'terms-of-service': 'Conditions d\'utilisation',
  'cookie-policy': 'Politique des cookies',
  'about': 'À propos',
};

export function generateMetadata({ params }: LegalPageProps): Metadata {
  return {
    title: `${TITLES[params.slug] ?? 'Page légale'} — Blog`,
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  let page;
  try {
    page = await apiClient.legal.getBySlug(params.slug);
  } catch {
    notFound();
  }

  return (
    <PageWrapper narrow>
      <article className="py-12">
        <header className="mb-8 pb-6 border-b border-[var(--border)]">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            {page.title ?? TITLES[params.slug]}
          </h1>
          {page.updatedAt && (
            <p className="text-sm text-[var(--text-muted)]">
              Dernière mise à jour : {formatDate(page.updatedAt)}
            </p>
          )}
        </header>
        <div
          className="prose prose-invert prose-sm max-w-none text-[var(--text-secondary)] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content ?? '' }}
        />
      </article>
    </PageWrapper>
  );
}