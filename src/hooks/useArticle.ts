import useSWR from 'swr';
import api from '@/lib/api-client';
import type { Article, PublicArticleResponse } from '@/types/api';

async function fetchArticle(slug: string): Promise<PublicArticleResponse> {
  return api.articles.getPublicOne(slug);
}

export function useArticle(slug: string | null, initialArticle?: Article) {
  const fallbackData = initialArticle
    ? ({ success: true, data: initialArticle } satisfies PublicArticleResponse)
    : undefined;

  const { data, error, isLoading, mutate } = useSWR<PublicArticleResponse>(
    slug ? ['article/public', slug] : null,
    ([, s]: [string, string]) => fetchArticle(s),
    { revalidateOnFocus: false, fallbackData },
  );

  return {
    article: data?.data ?? null,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}
