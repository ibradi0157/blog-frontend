'use client';

import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { LikedArticlesResponse, ArticleLikedStatusResponse } from '@/types/api';
import { useAuth } from '@/hooks/useAuth';

export function useBookmarks() {
  const { isAuthenticated } = useAuth();

  const { data, isLoading, mutate } = useSWR<LikedArticlesResponse>(
    isAuthenticated ? '/user-preferences/liked-articles' : null,
    () => apiClient.userPreferences.getLikedArticles(),
    { revalidateOnFocus: false }
  );

  const isBookmarked = (articleId: string) =>
    data?.data?.some((a) => a.id === articleId) ?? false;

  return {
    bookmarks: data?.data ?? [],
    total: data?.data?.length ?? 0,
    isLoading,
    isBookmarked,
    revalidate: mutate,
  };
}

export function useArticleLikedStatus(articleId: string) {
  const { isAuthenticated } = useAuth();

  const { data } = useSWR<ArticleLikedStatusResponse>(
    isAuthenticated && articleId ? `/user-preferences/article/${articleId}/liked` : null,
    () => apiClient.userPreferences.getArticleLikedStatus(articleId),
    { revalidateOnFocus: false }
  );

  return {
    isLiked: data?.isLiked ?? data?.data?.isLiked ?? false,
    likeType: data?.likeType ?? data?.data?.likeType,
  };
}