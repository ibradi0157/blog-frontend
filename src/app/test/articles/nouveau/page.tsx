import { Suspense } from 'react';
import { TestNouveauArticleClient } from './TestNouveauArticleClient';

/**
 * Sandbox de test pour /dashboard/articles/nouveau
 * URL : /test/articles/nouveau
 * URL (erreur autosave) : /test/articles/nouveau?failCreate=1
 */
export default function TestNouveauArticlePage() {
  return (
    <Suspense fallback={<div className="p-8 text-[var(--text-secondary)]">Chargement…</div>}>
      <TestNouveauArticleClient />
    </Suspense>
  );
}
