'use client';

import useSWR, { mutate } from 'swr';
import { apiClient } from '@/lib/api-client';
import { extractPagination } from '@/lib/pagination';
import { Comment, CreateCommentDto, CommentsListResponse } from '@/types/api';

const COMMENTS_KEY = (articleId: string) => `/comments/article/${articleId}`;

export function useComments(articleId: string) {
  const { data, error, isLoading, mutate: revalidate } = useSWR<CommentsListResponse>(
    articleId ? COMMENTS_KEY(articleId) : null,
    () => apiClient.comments.getForArticle(articleId),
    { revalidateOnFocus: false }
  );

  const addComment = async (dto: CreateCommentDto) => {
    const result = await apiClient.comments.create(dto);
    await revalidate();
    return result;
  };

  const replyToComment = async (dto: CreateCommentDto) => {
    const result = await apiClient.comments.create(dto);
    await revalidate();
    return result;
  };

  const deleteComment = async (commentId: string) => {
    await apiClient.comments.delete(commentId);
    await revalidate();
  };

  const likeComment = async (commentId: string, isLike: boolean = true) => {
    await apiClient.likes.likeComment(commentId, isLike);
    await revalidate();
  };

  const reportComment = async (commentId: string, reason: string) => {
    await apiClient.comments.report(commentId, reason);
  };

  const pagination = extractPagination(data);

  return {
    comments: data?.data ?? [],
    total: pagination.total,
    isLoading,
    error,
    addComment,
    replyToComment,
    deleteComment,
    likeComment,
    reportComment,
    revalidate,
  };
}