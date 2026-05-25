'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { CommentActions } from './CommentActions';
import { CommentReplyForm } from './CommentReplyForm';
import { timeAgo } from '@/lib/utils';
import { Comment } from '@/types/api';
import { ROUTES } from '@/lib/constants';

interface CommentItemProps {
  comment: Comment;
  articleId: string;
  isReply?: boolean;
  onLike: (commentId: string) => Promise<void>;
  onReply: (content: string, parentId?: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  onReport: (commentId: string) => void;
}

export function CommentItem({
  comment,
  articleId,
  isReply = false,
  onLike,
  onReply,
  onDelete,
  onReport,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={isReply ? 'ml-10 mt-3' : ''}>
      <div className="flex gap-3">
        <Link href={`/auteurs/${comment.author?.id ?? ""}`} className="flex-shrink-0">
          <UserAvatar user={{ ...comment.author!, displayName: comment.author?.displayName || undefined }} size="sm" />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <Link
              href={`/auteurs/${comment.authorId}`}
              className="text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
            >
              {comment.author?.username ?? 'Utilisateur'}
            </Link>
            <span className="text-xs text-[var(--text-muted)]">
              {timeAgo(comment.createdAt)}
            </span>
          </div>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap break-words">
            {comment.content}
          </p>

          <CommentActions
            comment={comment}
            onLike={onLike}
            onReply={() => setShowReplyForm(!showReplyForm)}
            onDelete={onDelete}
            onReport={onReport}
            isReplying={showReplyForm}
          />

          {showReplyForm && (
            <CommentReplyForm
              articleId={articleId}
              parentId={comment.id}
              replyingToUsername={comment.author?.username ?? undefined}
              onSubmit={async (content, parentId) => {
                await onReply(content, parentId);
                setShowReplyForm(false);
                setShowReplies(true);
              }}
              onCancel={() => setShowReplyForm(false)}
            />
          )}

          {hasReplies && !isReply && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="mt-2 text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
            >
              {showReplies
                ? 'Masquer les réponses'
                : `${comment.replies!.length} réponse${comment.replies!.length > 1 ? 's' : ''}`}
            </button>
          )}

          {showReplies && hasReplies && (
            <div className="mt-2 space-y-3">
              {comment.replies!.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  articleId={articleId}
                  isReply
                  onLike={onLike}
                  onReply={onReply}
                  onDelete={onDelete}
                  onReport={onReport}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}