'use client';

import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { ArticleCardSkeleton } from '@/components/articles/ArticleCardSkeleton';
import { Pagination } from '@/components/ui/pagination';
import { PublicArticlesResponse } from '@/types/api';
import { useState } from 'react';

interface CategoryPageClientProps {
  slug: string;
}

export function CategoryPageClient({ slug }: CategoryPageClientProps) {
  const [page, setPage] = useState(1);
  const LIMIT = 12;

  const { data, isLoading } = useSWR<PublicArticlesResponse>(
    `/articles/public?categoryId=${slug}&page=${page}`,
    () => apiClient.articles.getPublic({ categoryId: slug, page, limit: LIMIT }),
    { revalidateOnFocus: false }
  );

  const articles = data?.data ?? [];
  const totalPages = Math.ceil((data?.total ?? 0) / LIMIT);

  return (
    <div className="py-8 space-y-8">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] capitalize">{slug.replace(/-/g, ' ')}</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <ArticleCardSkeleton key={i} />)}
        </div>
      ) : articles.length === 0 ? (
        <p className="text-[var(--text-muted)] text-sm">Aucun article dans cette catégorie.</p>
      ) : (
        <>
          <ArticleGrid articles={articles} />
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}