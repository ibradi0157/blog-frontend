'use client';

import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { CategoriesResponse } from '@/types/api';

export function useCategories() {
  const { data, isLoading, error } = useSWR<CategoriesResponse>(
    '/categories',
    () => apiClient.categories.getAll(),
    { revalidateOnFocus: false, dedupingInterval: 60_000 }
  );

  return {
    categories: data?.data ?? [],
    isLoading,
    error,
  };
}