'use client';

import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { AnalyticsOverview, TimeSeriesResponse, RealTimeStats } from '@/types/api';

export function useAnalyticsOverview() {
  const { data, isLoading, error } = useSWR<AnalyticsOverview>(
    '/analytics/overview',
    async () => {
      const response = await apiClient.analytics.getOverview();
      return response?.data || response;
    },
    { refreshInterval: 60_000 }
  );
  return { overview: data, isLoading, error };
}

export function useAnalyticsTimeSeries(period: '7d' | '30d' | '90d' = '30d') {
  const { data, isLoading, error } = useSWR<TimeSeriesResponse>(
    `/analytics/timeseries?period=${period}`,
    () => apiClient.analytics.getTimeSeries(period),
    { revalidateOnFocus: false }
  );
  return { timeSeries: data, isLoading, error };
}

export function useRealTimeStats() {
  const { data, isLoading, error } = useSWR<RealTimeStats>(
    '/analytics/realtime',
    () => apiClient.analytics.getRealTime(),
    { refreshInterval: 5_000 }
  );
  return { realTime: data, isLoading, error };
}