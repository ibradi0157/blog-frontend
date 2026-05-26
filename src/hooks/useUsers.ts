'use client';

import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { extractPagination, type PaginationMeta } from '@/lib/pagination';
import type { ApiResponse, RoleName, User } from '@/types/api';

interface UseUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: RoleName;
}

export function useUsers({ page = 1, limit = 20, search, role }: UseUsersParams = {}) {
  const key = `/users?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}${role ? `&role=${role}` : ''}`;

  const { data, isLoading, error, mutate } = useSWR<
    ApiResponse<User[]> & { pagination?: PaginationMeta }
  >(
    key,
    () => apiClient.users.getAll({ page, limit, search, role }),
    { revalidateOnFocus: false }
  );

  const changeRole = async (userId: string, newRole: RoleName) => {
    await apiClient.users.changeRole(userId, { role: newRole });
    await mutate();
  };

  const banUser = async (userId: string) => {
    await apiClient.users.ban(userId);
    await mutate();
  };

  const pagination = extractPagination(data, { limit });

  return {
    users: data?.data ?? [],
    total: pagination.total,
    isLoading,
    error,
    changeRole,
    banUser,
    revalidate: mutate,
  };
}