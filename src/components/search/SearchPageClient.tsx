'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResults } from '@/components/search/SearchResults';
import { apiClient } from '@/lib/api-client';
import { extractPagination } from '@/lib/pagination';
import { PublicArticlesResponse } from '@/types/api';

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const sort = searchParams.get('sort') ?? 'relevance';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const LIMIT = 12;

  const swrKey = q ? `/search?q=${q}&category=${category}&sort=${sort}&page=${page}` : null;

  const { data, isLoading } = useSWR<PublicArticlesResponse>(
    swrKey,
    () => apiClient.articles.getPublic({ search: q, categoryId: category, page, limit: LIMIT }),
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    if (updates.q !== undefined || updates.category !== undefined || updates.sort !== undefined) {
      params.delete('page');
    }
    router.push(`/recherche?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Recherche</h1>

      <SearchBar
        defaultValue={q}
        onSearch={(query) => updateParams({ q: query })}
        className="max-w-xl"
      />

      <SearchFilters
        selectedCategory={category}
        selectedSort={sort}
        onCategoryChange={(cat) => updateParams({ category: cat })}
        onSortChange={(s) => updateParams({ sort: s })}
      />

      <SearchResults
        query={q}
        articles={data?.data ?? []}
        total={extractPagination(data, { limit: LIMIT }).total}
        page={page}
        limit={LIMIT}
        isLoading={isLoading}
        onPageChange={(p) => updateParams({ page: String(p) })}
      />
    </div>
  );
}