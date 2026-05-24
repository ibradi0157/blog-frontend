import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import type { ArticleSummary } from '@/types/api';
import { ROUTES } from '@/lib/constants';
import { timeAgo, estimateReadTime, resolveImageUrl } from '@/lib/utils';
import { UserAvatar } from '@/components/profile/UserAvatar';

interface ArticleListProps {
  articles: ArticleSummary[];
  isLoading?: boolean;
}

export function ArticleList({ articles, isLoading = false }: ArticleListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="card flex gap-4 p-4 animate-pulse">
            <div className="h-20 w-24 shrink-0 rounded-lg bg-[var(--bg-hover)]" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-3 w-16 rounded bg-[var(--bg-hover)]" />
              <div className="h-4 w-full rounded bg-[var(--bg-hover)]" />
              <div className="h-4 w-3/4 rounded bg-[var(--bg-hover)]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {articles.map(article => {
        const slug = article.slug ?? article.id;
        const author = article.author;

        return (
          <Link
            key={article.id}
            href={ROUTES.ARTICLE(slug)}
            className="card card-hover group flex gap-4 overflow-hidden p-4"
          >
            {article.coverUrl && (
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={resolveImageUrl(article.coverUrl)!}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="96px"
                />
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              {article.category && (
                <span className="text-xs font-medium text-[var(--accent)]">{article.category.name}</span>
              )}
              <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                {article.title}
              </h3>
              <div className="mt-auto flex items-center gap-3 text-xs text-[var(--text-muted)]">
                {author && (
                  <>
                    <UserAvatar user={author} size="xs" />
                    <span>{author.displayName}</span>
                    <span>·</span>
                  </>
                )}
                <span>{timeAgo(article.publishedAt ?? article.createdAt)}</span>
                {article.excerpt && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {estimateReadTime(article.excerpt)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
