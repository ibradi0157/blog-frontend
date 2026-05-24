'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { CheckFollowingResponse, FollowerCountResponse } from '@/types/api';
import { useAuth } from '@/hooks/useAuth';

export function useFollow(authorId: string) {
  const { isAuthenticated } = useAuth();
  const [isToggling, setIsToggling] = useState(false);

  const { data: statusData, mutate: mutateStatus } = useSWR<CheckFollowingResponse>(
    isAuthenticated && authorId ? `/subscriptions/check/author/${authorId}` : null,
    () => apiClient.subscriptions.checkFollowing(authorId),
    { revalidateOnFocus: false }
  );

  const { data: countData, mutate: mutateCount } = useSWR<FollowerCountResponse>(
    authorId ? `/subscriptions/followers/author/${authorId}` : null,
    () => apiClient.subscriptions.followerCount(authorId),
    { revalidateOnFocus: false }
  );

  const isFollowing = statusData?.isFollowing ?? false;
  const followerCount = countData?.count ?? 0;

  const toggle = async () => {
    if (!isAuthenticated || isToggling) return;
    setIsToggling(true);
    try {
      if (isFollowing) {
        await apiClient.subscriptions.unfollow(authorId);
      } else {
        await apiClient.subscriptions.follow(authorId);
      }
      await Promise.all([mutateStatus(), mutateCount()]);
    } finally {
      setIsToggling(false);
    }
  };

  return { isFollowing, followerCount, isToggling, toggle };
}