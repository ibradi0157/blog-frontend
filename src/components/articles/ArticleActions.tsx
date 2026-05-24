'use client';

import { useState } from 'react';
import { Heart, ThumbsDown, Share2, Check } from 'lucide-react';
import api from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';
import { copyToClipboard, formatCount } from '@/lib/utils';
import { cn } from '@/lib/cn';
import { useRouter } from 'next/navigation';

interface ArticleActionsProps {
  articleId: string;
  initialLikes?: number;
  initialLiked?: boolean;
  initialDisliked?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export function ArticleActions({
  articleId,
  initialLikes = 0,
  initialLiked = false,
  initialDisliked = false,
  orientation = 'horizontal',
}: ArticleActionsProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);
  const [disliked, setDisliked] = useState(initialDisliked);
  const [copied, setCopied] = useState(false);

  async function handleLike() {
    if (!isAuthenticated) { router.push(ROUTES.LOGIN); return; }
    try {
      const res = await api.likes.likeArticle(articleId, !liked);
      setLiked(!liked);
      setDisliked(false);
      if (res.likes !== undefined) setLikes(res.likes);
    } catch { /* ignore */ }
  }

  async function handleDislike() {
    if (!isAuthenticated) { router.push(ROUTES.LOGIN); return; }
    try {
      await api.likes.likeArticle(articleId, false);
      setDisliked(!disliked);
      setLiked(false);
    } catch { /* ignore */ }
  }

  async function handleShare() {
    const url = window.location.href;
    await copyToClipboard(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isVertical = orientation === 'vertical';

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        isVertical ? 'flex-col' : 'flex-row flex-wrap',
      )}
      role="group"
      aria-label="Actions article"
    >
      <button
        onClick={handleLike}
        className={cn(
          'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all',
          liked
            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            : 'border border-[var(--border)] text-[var(--text-muted)] hover:border-rose-500/30 hover:text-rose-400',
        )}
        aria-pressed={liked}
        aria-label="J'aime"
      >
        <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
        <span>{formatCount(likes)}</span>
      </button>

      <button
        onClick={handleDislike}
        className={cn(
          'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all',
          disliked
            ? 'bg-[var(--bg-hover)] text-[var(--text-secondary)] border border-[var(--border-hover)]'
            : 'border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)]',
        )}
        aria-pressed={disliked}
        aria-label="Je n'aime pas"
      >
        <ThumbsDown className="h-4 w-4" />
      </button>

      <button
        onClick={handleShare}
        className={cn(
          'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all border',
          copied
            ? 'border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]'
            : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)]',
        )}
        aria-label="Partager"
      >
        {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        <span>{copied ? 'Copié !' : 'Partager'}</span>
      </button>
    </div>
  );
}
