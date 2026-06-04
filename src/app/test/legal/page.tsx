'use client';

import Link from 'next/link';
import { LEGAL_PAGE_LABELS, LEGAL_PUBLIC_ROUTES } from '@/lib/legal-pages';
import type { LegalPageSlug } from '@/types/api';

/** Sandbox : liste légale sans backend (pages statiques). */
const MOCK_PUBLISHED = (Object.keys(LEGAL_PAGE_LABELS) as LegalPageSlug[]).map((slug) => ({
  slug,
  title: LEGAL_PAGE_LABELS[slug],
  published: true,
}));

export default function TestLegalIndexPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-200">
        Mode test — liste légale mockée, sans backend.
      </p>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Informations légales (test)</h1>
      <ul className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)]">
        {MOCK_PUBLISHED.map((page) => (
          <li key={page.slug}>
            <Link
              href={LEGAL_PUBLIC_ROUTES[page.slug as LegalPageSlug]}
              className="block px-5 py-4 hover:bg-[var(--bg-hover)] text-[var(--text-primary)]"
            >
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
