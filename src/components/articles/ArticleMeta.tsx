'use client';

import Link from 'next/link';
import { Calendar, Clock, Folder } from 'lucide-react';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { formatDate, timeAgo, estimateReadTime } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import type { Article, ArticleSummary } from '@/types/api';

interface ArticleMetaProps {
  article: ArticleSummary | Article;
  compact?: boolean;
  className?: string;
}

export function ArticleMeta({ article, compact = false, className = '' }: ArticleMetaProps) {
  const content = 'content' in article ? article.content : undefined;
  const readTime = estimateReadTime(content ?? '');
  const publishedAt = article.publishedAt ?? article.createdAt;
  const author = article.author;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-sm text-[var(--text-secondary)] ${className}`}>
        {author && <UserAvatar user={author} size="xs" />}
        <span className="font-medium text-[var(--text-primary)] truncate max-w-[120px]">
          {author?.displayName ?? 'Auteur inconnu'}
        </span>
        <span className="opacity-40">·</span>
        <time dateTime={publishedAt} title={formatDate(publishedAt)}>
          {timeAgo(publishedAt)}
        </time>
        {content && (
          <>
            <span className="opacity-40">·</span>
            <span>{readTime}</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        {author && (
          <Link
            href={ROUTES.AUTHOR(author.id)}
            className="flex-shrink-0 ring-2 ring-transparent hover:ring-[var(--accent)] rounded-full transition-all duration-200"
          >
            <UserAvatar user={author} size="md" />
          </Link>
        )}

        <div className="min-w-0">
          {author && (
            <Link
              href={ROUTES.AUTHOR(author.id)}
              className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors truncate block"
            >
              {author.displayName}
            </Link>
          )}

          <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <time dateTime={publishedAt} title={formatDate(publishedAt)}>
                {formatDate(publishedAt)}
              </time>
            </span>

            {content && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {readTime}
              </span>
            )}
          </div>
        </div>
      </div>

      {article.category && (
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-[var(--text-muted)]" />
          <Link
            href={`${ROUTES.ARTICLES}?category=${article.category.slug ?? ''}`}
            className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            {article.category.name}
          </Link>
        </div>
      )}
    </div>
  );
}
