import useSWR from 'swr';
import api from '@/lib/api-client';
import type { PublicArticlesResponse, ArticlesQueryParams } from '@/types/api';

function buildKey(params: ArticlesQueryParams) {
  return ['articles/public', JSON.stringify(params)];
}

async function fetchArticles([, paramsJson]: [string, string]): Promise<PublicArticlesResponse> {
  const params = JSON.parse(paramsJson) as ArticlesQueryParams;
  return api.articles.getPublic(params);
}

export function useArticles(params: ArticlesQueryParams = {}) {
  const key = buildKey(params);

  const { data, error, isLoading, mutate } = useSWR<PublicArticlesResponse>(
    key,
    fetchArticles,
    { revalidateOnFocus: false },
  );

  return {
    articles: data?.data ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    limit: data?.limit ?? 12,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}
