'use client';

import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { NotificationsResponse } from '@/types/api';
import { useNotificationStore } from '@/store/notificationStore';

export function useNotifications(page = 1, limit = 20) {
  const { markRead, markAllRead } = useNotificationStore();

  const { data, isLoading, error, mutate } = useSWR<NotificationsResponse>(
    `/notifications?page=${page}&limit=${limit}`,
    () => apiClient.notifications.getAll({ page, limit }),
    { revalidateOnFocus: true }
  );

  const handleMarkRead = async (id: string) => {
    await apiClient.notifications.markRead(id);
    markRead(id);
    await mutate();
  };

  const handleMarkAllRead = async () => {
    await apiClient.notifications.markAllRead();
    markAllRead();
    await mutate();
  };

  return {
    notifications: data?.data ?? [],
    total: data?.total ?? 0,
    unreadCount: data?.unreadCount ?? 0,
    isLoading,
    error,
    markRead: handleMarkRead,
    markAllRead: handleMarkAllRead,
    revalidate: mutate,
  };
}