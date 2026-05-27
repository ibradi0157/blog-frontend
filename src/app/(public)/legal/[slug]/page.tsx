import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { apiClient } from '@/lib/api-client';
import { LegalPageSlug } from '@/types/api';
import { formatDate } from '@/lib/utils';

interface LegalPageProps {
  params: Promise<{ slug: LegalPageSlug }>;
}

const TITLES: Record<string, string> = {
  'privacy-policy': 'Politique de confidentialité',
  'terms-of-service': 'Conditions d\'utilisation',
  'cookie-policy': 'Politique des cookies',
  'about': 'À propos',
};

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${TITLES[slug] ?? 'Page légale'} — Blog`,
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  let page;
  try {
    const response = await apiClient.legal.getBySlug(slug);
    page = response.data;
    if (!page) notFound();
  } catch {
    notFound();
  }

  return (
    <PageWrapper narrow>
      <article className="py-12">
        <header className="mb-8 pb-6 border-b border-[var(--border)]">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            {page.title ?? TITLES[slug]}
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
