'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { timeAgo, estimateReadTime, resolveImageUrl } from '@/lib/utils';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { ArticleTags } from './ArticleTags';
import type { ArticleSummary } from '@/types/api';

interface FeaturedArticleProps {
  article: ArticleSummary;
  priority?: boolean;
}

export function FeaturedArticle({ article, priority = true }: FeaturedArticleProps) {
  const slug = article.slug ?? article.id;
  const publishedAt = article.publishedAt ?? article.createdAt;
  const author = article.author;

  return (
    <Link
      href={ROUTES.ARTICLE(slug)}
      className="group relative flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--border-hover)] bg-[var(--bg-card)] transition-all duration-300 hover:shadow-2xl hover:shadow-black/40 no-underline"
    >
      <div className="relative md:w-1/2 aspect-[16/9] md:aspect-auto min-h-[220px] md:min-h-[340px] bg-[var(--bg-hover)] flex-shrink-0 overflow-hidden">
        {article.coverUrl ? (
          <Image
            src={resolveImageUrl(article.coverUrl)!}
            alt={article.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-muted)] via-[var(--bg-hover)] to-[var(--bg-base)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />

        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-[var(--accent)] text-white shadow-lg">
          À la une
        </span>
      </div>

      <div className="flex flex-col justify-between p-6 md:p-8 md:w-1/2">
        {article.category && (
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-3">
            {article.category.name}
          </span>
        )}

        <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-200 leading-tight mb-4">
          {article.title}
        </h2>

        {article.excerpt && (
          <p className="text-[var(--text-secondary)] text-base leading-relaxed line-clamp-3 mb-6">
            {article.excerpt}
          </p>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="mb-6">
            <ArticleTags tags={article.tags.slice(0, 3)} />
          </div>
        )}

        <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-[var(--border)]">
          {author && (
            <div className="flex items-center gap-3">
              <UserAvatar user={author} size="sm" />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {author.displayName}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">{timeAgo(publishedAt)}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
            {article.excerpt && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {estimateReadTime(article.excerpt)}
              </span>
            )}
            <span className="flex items-center gap-1 text-[var(--accent)] font-medium group-hover:gap-2 transition-all">
              Lire <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
