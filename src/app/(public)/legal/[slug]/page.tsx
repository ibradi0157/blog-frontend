import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { apiClient } from '@/lib/api-client';
import type { LegalPage, LegalPageSlug } from '@/types/api';
import { formatDate } from '@/lib/utils';
import { LEGAL_PAGE_LABELS } from '@/lib/legal-pages';

interface LegalPageProps {
  params: Promise<{ slug: LegalPageSlug }>;
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${LEGAL_PAGE_LABELS[slug] ?? 'Page légale'} — Blog`,
  };
}

function unwrapLegalPage(response: unknown): LegalPage | null {
  if (!response || typeof response !== 'object') return null;
  if ('data' in response && (response as { data?: LegalPage }).data) {
    return (response as { data: LegalPage }).data;
  }
  return response as LegalPage;
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  let page: LegalPage | null = null;
  try {
    const response = await apiClient.legal.getBySlug(slug);
    page = unwrapLegalPage(response);
    if (!page) notFound();
  } catch {
    notFound();
  }

  return (
    <PageWrapper narrow>
      <article className="py-12">
        <header className="mb-8 pb-6 border-b border-[var(--border)]">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            {page.title ?? LEGAL_PAGE_LABELS[slug]}
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
