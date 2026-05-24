'use client';

import { useState } from 'react';
import { ThumbsUp, Reply, Flag, Trash2, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/cn';
import { Comment } from '@/types/api';

interface CommentActionsProps {
  comment: Comment;
  onLike: (commentId: string) => Promise<void>;
  onReply: () => void;
  onDelete?: (commentId: string) => Promise<void>;
  onReport: (commentId: string) => void;
  isReplying?: boolean;
}

export function CommentActions({
  comment,
  onLike,
  onReply,
  onDelete,
  onReport,
  isReplying,
}: CommentActionsProps) {
  const { user, isAuthenticated } = useAuth();
  const [liking, setLiking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isOwner = user?.id === comment.authorId;

  const handleLike = async () => {
    if (!isAuthenticated || liking) return;
    setLiking(true);
    try { await onLike(comment.id); } finally { setLiking(false); }
  };

  return (
    <div className="flex items-center gap-3 mt-2">
      <button
        onClick={handleLike}
        disabled={liking || !isAuthenticated}
        className={cn(
          'flex items-center gap-1.5 text-xs transition-colors',
          comment.isLiked
            ? 'text-[var(--accent)]'
            : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
          'disabled:opacity-50'
        )}
      >
        <ThumbsUp size={13} className={liking ? 'animate-pulse' : ''} />
        {comment.likesCount > 0 && <span>{comment.likesCount}</span>}
      </button>

      {isAuthenticated && (
        <button
          onClick={onReply}
          className={cn(
            'flex items-center gap-1.5 text-xs transition-colors',
            isReplying
              ? 'text-[var(--accent)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          )}
        >
          <Reply size={13} />
          <span>Répondre</span>
        </button>
      )}

      <div className="relative ml-auto">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 text-[var(--text-muted)] hover:text-[var(--text-secondary)] rounded transition-colors"
        >
          <MoreHorizontal size={14} />
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-7 z-20 card min-w-[140px] py-1 shadow-lg animate-fade-in-fast">
              {isOwner && onDelete && (
                <button
                  onClick={async () => { setShowMenu(false); await onDelete(comment.id); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-[var(--error)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  <Trash2 size={13} />
                  Supprimer
                </button>
              )}
              {!isOwner && isAuthenticated && (
                <button
                  onClick={() => { setShowMenu(false); onReport(comment.id); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  <Flag size={13} />
                  Signaler
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}