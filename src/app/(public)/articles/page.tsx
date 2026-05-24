import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ArticlesPageClient } from '@/components/articles/ArticlesPageClient';

export const metadata: Metadata = {
  title: 'Articles — Blog',
  description: 'Explorez tous nos articles, tutoriels et analyses.',
};

export default function ArticlesPage() {
  return (
    <Suspense fallback={<ArticlesPageSkeleton />}>
      <ArticlesPageClient />
    </Suspense>
  );
}

function ArticlesPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-10 bg-[var(--bg-hover)] rounded-lg w-48 mb-8" />
      <div className="flex gap-3 mb-8 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 bg-[var(--bg-hover)] rounded-full w-24" />
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="card h-72" />
        ))}
      </div>
    </div>
  );
}