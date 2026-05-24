'use client';

import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { ArticleCardSkeleton } from '@/components/articles/ArticleCardSkeleton';
import { Pagination } from '@/components/ui/pagination';
import { PublicArticle } from '@/types/api';
import { SearchX } from 'lucide-react';

interface SearchResultsProps {
  query: string;
  articles: PublicArticle[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function SearchResults({
  query,
  articles,
  total,
  page,
  limit,
  isLoading,
  onPageChange,
}: SearchResultsProps) {
  const totalPages = Math.ceil(total / limit);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <ArticleCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-16 text-[var(--text-muted)]">
        <p className="text-lg">Entrez un terme de recherche pour commencer</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 gap-4 text-[var(--text-muted)]">
        <SearchX size={48} className="opacity-30" />
        <div className="text-center">
          <p className="text-lg font-medium text-[var(--text-secondary)]">Aucun résultat pour « {query} »</p>
          <p className="text-sm mt-1">Essayez avec d'autres mots-clés ou moins de filtres.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--text-muted)]">
        <span className="font-medium text-[var(--text-secondary)]">{total}</span> résultat{total > 1 ? 's' : ''} pour « {query} »
      </p>

      <ArticleGrid articles={articles} />

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}