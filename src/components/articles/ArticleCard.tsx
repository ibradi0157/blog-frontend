import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import type { ArticleSummary } from '@/types/api';
import { ROUTES } from '@/lib/constants';
import { timeAgo, estimateReadTime, resolveImageUrl } from '@/lib/utils';
import { UserAvatar } from '@/components/profile/UserAvatar';
import { cn } from '@/lib/cn';

interface ArticleCardProps {
  article: ArticleSummary;
  className?: string;
}

export function ArticleCard({ article, className }: ArticleCardProps) {
  const slug = article.slug ?? article.id;
  const author = article.author;

  return (
    <article className={cn('card card-hover group flex flex-col overflow-hidden', className)}>
      {article.coverUrl && (
        <Link href={ROUTES.ARTICLE(slug)} className="relative block h-48 overflow-hidden">
          <Image
            src={resolveImageUrl(article.coverUrl)!}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)]/60 to-transparent" />
        </Link>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        {article.category && (
          <Link
            href={`${ROUTES.ARTICLES}?category=${article.category.slug ?? ''}`}
            className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors w-fit"
          >
            {article.category.name}
          </Link>
        )}

        <Link href={ROUTES.ARTICLE(slug)}>
          <h2 className="line-clamp-2 text-base font-bold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
            {article.title}
          </h2>
        </Link>

        {article.excerpt && (
          <p className="line-clamp-2 text-sm text-[var(--text-secondary)]">{article.excerpt}</p>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {article.tags.slice(0, 3).map(tag => (
              <Link
                key={tag}
                href={`${ROUTES.SEARCH}?tag=${encodeURIComponent(tag)}`}
                className="rounded-full border border-[var(--border)] bg-[var(--bg-hover)] px-2.5 py-0.5 text-xs text-[var(--text-muted)] hover:border-[var(--accent)]/40 hover:text-[var(--accent)] transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-[var(--border)]">
          {author && (
            <Link
              href={ROUTES.AUTHOR(author.id)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <UserAvatar user={author} size="xs" />
              <div>
                <span className="block text-xs font-medium text-[var(--text-secondary)]">
                  {author.displayName}
                </span>
                <span className="block text-xs text-[var(--text-muted)]">
                  {timeAgo(article.publishedAt ?? article.createdAt)}
                </span>
              </div>
            </Link>
          )}

          {article.excerpt && (
            <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Clock className="h-3 w-3" />
              {estimateReadTime(article.excerpt)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
