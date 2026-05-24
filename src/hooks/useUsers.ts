'use client';

import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { MembersResponse } from '@/types/api';

interface UseUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export function useUsers({ page = 1, limit = 20, search, role }: UseUsersParams = {}) {
  const key = `/users?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}${role ? `&role=${role}` : ''}`;

  const { data, isLoading, error, mutate } = useSWR<MembersResponse>(
    key,
    () => apiClient.users.getAll({ page, limit, search, role }),
    { revalidateOnFocus: false }
  );

  const changeRole = async (userId: string, newRole: string) => {
    await apiClient.users.changeRole(userId, { role: newRole });
    await mutate();
  };

  const banUser = async (userId: string) => {
    await apiClient.users.ban(userId);
    await mutate();
  };

  return {
    users: data?.data ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    changeRole,
    banUser,
    revalidate: mutate,
  };
}