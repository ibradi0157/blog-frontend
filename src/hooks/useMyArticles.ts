'use client';

import useSWR from 'swr';
import api from '@/lib/api-client';
import { extractPagination } from '@/lib/pagination';
import type { ArticlesListResponse, ArticlesQueryParams } from '@/types/api';

function buildKey(params: ArticlesQueryParams) {
  return ['articles/mine', JSON.stringify(params)];
}

async function fetchMyArticles([, paramsJson]: [string, string]): Promise<ArticlesListResponse> {
  const params = JSON.parse(paramsJson) as ArticlesQueryParams;
  return api.articles.getAll(params);
}

/** Articles de l'utilisateur connecté (dashboard) — endpoint authentifié GET /articles */
export function useMyArticles(params: ArticlesQueryParams = {}) {
  const key = buildKey(params);

  const { data, error, isLoading, mutate } = useSWR<ArticlesListResponse>(
    key,
    fetchMyArticles,
    { revalidateOnFocus: false },
  );

  const pagination = extractPagination(data, { limit: params.limit ?? 12 });

  return {
    articles: data?.data ?? [],
    total: pagination.total,
    page: pagination.page,
    limit: pagination.limit,
    pages: pagination.pages ?? 0,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}
