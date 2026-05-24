'use client';

import Link from 'next/link';
import { TrendingUp, Clock } from 'lucide-react';
import type { ArticleSummary } from '@/types/api';
import { ROUTES } from '@/lib/constants';
import { estimateReadTime } from '@/lib/utils';
import { UserAvatar } from '@/components/profile/UserAvatar';

interface TrendingSectionProps {
  articles: ArticleSummary[];
}

export function TrendingSection({ articles }: TrendingSectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="h-5 w-5 text-[var(--accent)]" />
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Tendances</h2>
        </div>

        <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 6).map((article, index) => {
            const author = article.author;

            return (
              <li key={article.id}>
                <Link
                  href={ROUTES.ARTICLE(article.slug ?? article.id)}
                  className="card card-hover group flex gap-4 p-5"
                >
                  <span
                    className="shrink-0 text-4xl font-black leading-none"
                    style={{ color: index < 3 ? 'var(--accent)' : 'var(--text-muted)' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="flex flex-col gap-2 min-w-0">
                    {article.category && (
                      <span className="text-xs font-medium text-[var(--accent)] truncate">
                        {article.category.name}
                      </span>
                    )}
                    <h3 className="text-sm font-semibold leading-snug text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      {author && (
                        <>
                          <UserAvatar user={author} size="xs" />
                          <span>{author.displayName}</span>
                          <span>·</span>
                        </>
                      )}
                      {article.excerpt && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {estimateReadTime(article.excerpt)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
