import useSWR from 'swr';
import api from '@/lib/api-client';
import type { PublicHomepageResponse } from '@/types/api';

async function fetchHomepage(): Promise<PublicHomepageResponse> {
  return api.homepage.getPublic();
}

export function useHomepage() {
  const { data, error, isLoading, mutate } = useSWR<PublicHomepageResponse>(
    'homepage',
    fetchHomepage,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );

  return {
    homepage: data,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}
