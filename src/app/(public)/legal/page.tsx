import Link from 'next/link';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { apiClient } from '@/lib/api-client';
import { LEGAL_PAGE_LABELS, LEGAL_PUBLIC_ROUTES } from '@/lib/legal-pages';
import type { LegalPage, LegalPageSlug } from '@/types/api';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Informations légales — Blog',
  description: 'Politique de confidentialité, conditions d\'utilisation et autres pages légales.',
};

function unwrapLegalList(response: unknown): LegalPage[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (typeof response === 'object' && 'data' in response) {
    const data = (response as { data?: LegalPage[] }).data;
    return Array.isArray(data) ? data : [];
  }
  return [];
}

export default async function LegalIndexPage() {
  let pages: LegalPage[] = [];
  try {
    const response = await apiClient.legal.listPublished();
    pages = unwrapLegalList(response);
  } catch {
    pages = [];
  }

  return (
    <PageWrapper narrow>
      <div className="py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Informations légales
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Consultez nos documents légaux publiés.
          </p>
        </header>

        {pages.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] rounded-lg border border-[var(--border)] p-6">
            Aucune page légale n&apos;est publiée pour le moment. Les administrateurs peuvent les
            activer depuis l&apos;espace admin.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] overflow-hidden">
            {pages.map((page) => {
              const slug = page.slug as LegalPageSlug;
              const href = LEGAL_PUBLIC_ROUTES[slug] ?? `/legal/${page.slug}`;
              const label = page.title ?? LEGAL_PAGE_LABELS[slug] ?? page.slug;
              return (
                <li key={page.slug}>
                  <Link
                    href={href}
                    className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-[var(--bg-hover)] transition-colors group"
                  >
                    <span className="font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                      {label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PageWrapper>
  );
}
