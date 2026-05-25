'use client';

import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { NotificationsResponse } from '@/types/api';
import { useNotificationStore } from '@/store/notificationStore';

export function useNotifications(page = 1, limit = 20) {
  const { markRead, markAllRead } = useNotificationStore();
  const offset = (page - 1) * limit;

  const { data, isLoading, error, mutate } = useSWR<NotificationsResponse>(
    `/notifications?offset=${offset}&limit=${limit}`,
    () => apiClient.notifications.getAll({ offset, limit }),
    { revalidateOnFocus: true }
  );

  const handleMarkRead = async (id: string) => {
    await apiClient.notifications.markAsRead(id);
    markRead(id);
    await mutate();
  };

  const handleMarkAllRead = async () => {
    await apiClient.notifications.markAllAsRead();
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